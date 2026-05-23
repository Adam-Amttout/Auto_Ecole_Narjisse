<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Moniteur;
use App\Models\Notification;
use App\Models\SeanceConduite;
use App\Models\Vehicule;
use Illuminate\Http\Request;

class SeanceConduiteController extends Controller
{
    /**
     * ✅ Créneaux de 30 minutes, de 08h00 à 19h30
     * Chaque créneau dure exactement 30 minutes.
     */
    private const HEURES_AUTORISEES = [
        '08:00', '08:30',
        '09:00', '09:30',
        '10:00', '10:30',
        '11:00', '11:30',
        '12:00', '12:30',
        '13:00', '13:30',
        '14:00', '14:30',
        '15:00', '15:30',
        '16:00', '16:30',
        '17:00', '17:30',
        '18:00', '18:30',
        '19:00', '19:30',
    ];

    /**
     * Vérifie que l'heure de début est un créneau autorisé.
     */
    private function heureValide(string $heure): bool
    {
        $normalized = date('H:i', strtotime($heure));
        return in_array($normalized, self::HEURES_AUTORISEES);
    }

    /**
     * Calcule l'heure de fin attendue (début + 30 minutes).
     */
    private function heureFinAttendue(string $heureDebut): string
    {
        return date('H:i', strtotime($heureDebut . ' +30 minutes'));
    }

    /** Helper : crée une notification privée pour un client */
    private function notifClient(int $clientId, string $type, string $titre, string $message, string $icon, string $color): void
    {
        Notification::create([
            'client_id' => $clientId,
            'type'      => $type,
            'titre'     => $titre,
            'message'   => $message,
            'icon'      => $icon,
            'color'     => $color,
            'lu'        => false,
        ]);
    }

    /** GET /api/seances */
    public function index(Request $request)
    {
        $query = SeanceConduite::with(['client', 'moniteur', 'vehicule']);

        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }
        if ($request->has('mois') && $request->has('annee')) {
            $query->whereYear('date', $request->annee)->whereMonth('date', $request->mois);
        }
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        return response()->json($query->orderBy('date')->orderBy('heure_debut')->get())
            ->header('Cache-Control', 'public, max-age=30');
    }

    /** GET /api/seances/moniteur-by-email?email=... */
    public function byMoniteurEmail(Request $request)
    {
        $email = $request->query('email');
        if (!$email) {
            return response()->json(['message' => 'Email requis.'], 422);
        }

        $moniteur = \App\Models\Moniteur::where('email', $email)->first();

        // ✅ Auto-create : si le client existe avec role=moniteur mais pas encore dans moniteurs
        if (!$moniteur) {
            $client = \App\Models\Client::where('email', $email)
                ->where('role', 'moniteur')
                ->first();

            if (!$client) {
                return response()->json(['message' => 'Aucun moniteur trouvé avec cet email.'], 404);
            }

            // Générer un téléphone unique s'il n'en a pas
            $tel = $client->telephone ?? ('0600' . str_pad($client->id, 6, '0', STR_PAD_LEFT));

            $moniteur = \App\Models\Moniteur::firstOrCreate(
                ['email' => $email],
                [
                    'nom'       => $client->nom,
                    'prenom'    => $client->prenom,
                    'telephone' => $tel,
                    'actif'     => true,
                ]
            );
        }

        $seances = SeanceConduite::with(['client', 'vehicule'])
            ->where('moniteur_id', $moniteur->id)
            ->orderBy('date', 'desc')
            ->orderBy('heure_debut', 'asc')
            ->get()
            ->map(function ($s) use ($moniteur) {
                return array_merge($s->toArray(), [
                    'moniteur' => $moniteur->toArray(),
                ]);
            });

        return response()->json([
            'moniteur' => $moniteur,
            'seances'  => $seances,
        ]);
    }


    /**
     * GET /api/seances/creneaux
     * Retourne tous les créneaux de 30 min avec leur disponibilité.
     * ✅ Un créneau est disponible seulement si AUCUNE séance active n'existe dessus.
     */
    public function creneaux(Request $request)
    {
        $request->validate([
            'date'        => 'required|date|after_or_equal:today',
            'moniteur_id' => 'nullable|exists:moniteurs,id',
            'vehicule_id' => 'nullable|exists:vehicules,id',
            'client_id'   => 'nullable|exists:clients,id',
        ]);

        $date       = $request->date;
        $moniteurId = $request->moniteur_id;
        $vehiculeId = $request->vehicule_id;
        $clientId   = $request->client_id;
        $creneaux   = [];

        foreach (self::HEURES_AUTORISEES as $heure) {
            $heureFin   = $this->heureFinAttendue($heure);
            $disponible = true;
            $raison     = null;

            // ── Vérifier le moniteur (max 1 élève)
            if ($moniteurId) {
                $moniteur = Moniteur::find($moniteurId);
                if ($moniteur) {
                    if (!$moniteur->actif) {
                        $disponible = false;
                        $raison = 'Moniteur inactif';
                    } elseif (!$moniteur->estDisponible($date, $heure, $heureFin)) {
                        $disponible = false;
                        $raison = 'Moniteur déjà réservé';
                    }
                }
            }

            // ── Vérifier le véhicule (max 1 élève)
            if ($disponible && $vehiculeId) {
                $vehicule = Vehicule::find($vehiculeId);
                if ($vehicule) {
                    if (!$vehicule->estDisponible($date, $heure, $heureFin)) {
                        $disponible = false;
                        $raison = $vehicule->disponibilite !== 'disponible'
                            ? 'Véhicule en maintenance'
                            : 'Véhicule déjà réservé';
                    }
                }
            }

            // ── Vérifier l'élève (un seul créneau actif par date/heure)
            if ($disponible && $clientId) {
                $conflitEleve = SeanceConduite::where('client_id', $clientId)
                    ->where('date', $date)
                    ->where('statut', '!=', 'annulee')
                    ->where('heure_debut', '<', $heureFin)
                    ->where('heure_fin',   '>', $heure)
                    ->exists();

                if ($conflitEleve) {
                    $disponible = false;
                    $raison = 'Vous avez déjà une séance sur ce créneau';
                }
            }

            $creneaux[] = [
                'heure_debut' => $heure,
                'heure_fin'   => $heureFin,
                'disponible'  => $disponible,
                'raison'      => $raison,
                // ✅ Toujours 0 ou 1 place (exclusivité totale)
                'places'      => $disponible ? 1 : 0,
            ];
        }

        return response()->json($creneaux);
    }

    /** POST /api/seances */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id'   => 'required|exists:clients,id',
            'moniteur_id' => 'required|exists:moniteurs,id',
            'vehicule_id' => 'required|exists:vehicules,id',
            'date'        => 'required|date|after_or_equal:today',
            'heure_debut' => 'required|date_format:H:i',
            'notes'       => 'nullable|string|max:500',
        ]);

        // ✅ Validation : heure de début doit être un créneau autorisé
        if (!$this->heureValide($validated['heure_debut'])) {
            return response()->json([
                'message' => "L'heure de début n'est pas un créneau valide. Choisissez un créneau de 30 minutes (08:00, 08:30, 09:00…).",
            ], 422);
        }

        // ✅ Heure de fin calculée automatiquement : début + 30 minutes
        $heureFin = $this->heureFinAttendue($validated['heure_debut']);
        $validated['heure_fin'] = $heureFin;

        $moniteur = Moniteur::findOrFail($validated['moniteur_id']);
        $vehicule  = Vehicule::findOrFail($validated['vehicule_id']);

        // ── Vérifier moniteur actif
        if (!$moniteur->actif) {
            return response()->json(['message' => "Ce moniteur n'est plus actif."], 422);
        }

        // ── Vérifier disponibilité moniteur (max 1 élève)
        if (!$moniteur->estDisponible($validated['date'], $validated['heure_debut'], $heureFin)) {
            return response()->json([
                'message' => "Ce créneau est déjà réservé avec ce moniteur. Veuillez choisir un autre créneau.",
            ], 422);
        }

        // ── Vérifier disponibilité véhicule (max 1 élève)
        if (!$vehicule->estDisponible($validated['date'], $validated['heure_debut'], $heureFin)) {
            if ($vehicule->disponibilite !== 'disponible') {
                return response()->json(['message' => 'Ce véhicule est en maintenance ou hors service.'], 422);
            }
            return response()->json([
                'message' => "Ce créneau est déjà réservé avec ce véhicule. Veuillez choisir un autre créneau.",
            ], 422);
        }

        // ── Vérifier que l'élève n'a pas déjà une séance sur ce créneau (protection supplémentaire)
        $conflitEleve = SeanceConduite::where('client_id', $validated['client_id'])
            ->where('date', $validated['date'])
            ->where('statut', '!=', 'annulee')
            ->where('heure_debut', '<', $heureFin)
            ->where('heure_fin',   '>', $validated['heure_debut'])
            ->exists();

        if ($conflitEleve) {
            return response()->json(['message' => 'Vous avez déjà une séance planifiée sur ce créneau.'], 422);
        }

        $seance = SeanceConduite::create($validated);
        $seance->load(['client', 'moniteur', 'vehicule']);

        // ── 🔔 Notification privée : séance planifiée
        $dateF    = \Carbon\Carbon::parse($validated['date'])->locale('fr')->isoFormat('dddd D MMMM YYYY');
        $monitNom = $moniteur->prenom . ' ' . $moniteur->nom;
        $this->notifClient(
            $validated['client_id'],
            'seance',
            '📅 Séance planifiée !',
            "Votre séance de conduite du {$dateF} à {$validated['heure_debut']} (30 min) avec {$monitNom} a été confirmée.",
            '📅',
            '#2563eb'
        );

        return response()->json([
            'message' => 'Séance de 30 minutes planifiée avec succès !',
            'data'    => $seance,
        ], 201);
    }

    /** GET /api/seances/{id} */
    public function show($id)
    {
        return response()->json(SeanceConduite::with(['client', 'moniteur', 'vehicule'])->findOrFail($id));
    }

    /** PUT /api/seances/{id} */
    public function update(Request $request, $id)
    {
        $seance = SeanceConduite::findOrFail($id);

        if (!in_array($seance->statut, ['planifiee'])) {
            return response()->json(['message' => 'Seules les séances planifiées peuvent être modifiées.'], 422);
        }

        $validated = $request->validate([
            'moniteur_id' => 'sometimes|required|exists:moniteurs,id',
            'vehicule_id' => 'sometimes|required|exists:vehicules,id',
            'date'        => 'sometimes|required|date|after_or_equal:today',
            'heure_debut' => 'sometimes|required|date_format:H:i',
            'statut'      => 'sometimes|in:planifiee,en_cours,terminee,annulee',
            'notes'       => 'nullable|string|max:500',
        ]);

        $date       = $validated['date']        ?? $seance->date->format('Y-m-d');
        $heureDebut = $validated['heure_debut'] ?? $seance->heure_debut;
        $moniteurId = $validated['moniteur_id'] ?? $seance->moniteur_id;
        $vehiculeId = $validated['vehicule_id'] ?? $seance->vehicule_id;

        // ✅ Validation heure créneau si modifiée
        if (isset($validated['heure_debut']) && !$this->heureValide($heureDebut)) {
            return response()->json(['message' => "L'heure de début n'est pas un créneau valide (créneaux de 30 min)."], 422);
        }

        // ✅ Recalcul automatique heure_fin = debut + 30 min
        $heureFin = $this->heureFinAttendue($heureDebut);
        $validated['heure_fin'] = $heureFin;

        // ── Vérifier moniteur
        $moniteur = Moniteur::findOrFail($moniteurId);
        if (!$moniteur->estDisponible($date, $heureDebut, $heureFin, $seance->id)) {
            return response()->json(['message' => "Ce créneau est déjà réservé avec ce moniteur."], 422);
        }

        // ── Vérifier véhicule
        $vehicule = Vehicule::findOrFail($vehiculeId);
        if (!$vehicule->estDisponible($date, $heureDebut, $heureFin, $seance->id)) {
            if ($vehicule->disponibilite !== 'disponible') {
                return response()->json(['message' => 'Véhicule indisponible.'], 422);
            }
            return response()->json(['message' => "Ce créneau est déjà réservé avec ce véhicule."], 422);
        }

        // ✅ Le conflit moniteur/véhicule est déjà vérifié ci-dessus — pas besoin de bloquer tout le créneau globalement

        $oldStatut = $seance->statut;
        $seance->update($validated);
        $seance->load(['client', 'moniteur', 'vehicule']);

        // ── 🔔 Notification si passage à "terminee"
        if (isset($validated['statut']) && $validated['statut'] === 'terminee' && $oldStatut !== 'terminee') {
            $this->notifClient(
                $seance->client_id,
                'seance',
                '✅ Séance terminée !',
                "Bravo ! Vous avez complété votre séance de conduite du " . \Carbon\Carbon::parse($date)->locale('fr')->isoFormat('D MMMM') . ". Continuez comme ça !",
                '✅',
                '#15803d'
            );
        }

        return response()->json(['message' => 'Séance mise à jour.', 'data' => $seance]);
    }

    /** DELETE /api/seances/{id} */
    public function destroy($id)
    {
        $seance = SeanceConduite::findOrFail($id);
        if (in_array($seance->statut, ['en_cours', 'terminee'])) {
            return response()->json(['message' => 'Impossible de supprimer une séance en cours ou terminée.'], 422);
        }
        $seance->delete();
        return response()->json(['message' => 'Séance supprimée.']);
    }

    /** PATCH /api/seances/{id}/annuler */
    public function annuler($id)
    {
        $seance = SeanceConduite::with(['moniteur'])->findOrFail($id);

        if ($seance->statut === 'terminee') {
            return response()->json(['message' => 'Séance déjà terminée.'], 422);
        }

        $seance->update(['statut' => 'annulee']);

        // ── 🔔 Notification privée : séance annulée
        $dateF = \Carbon\Carbon::parse($seance->date)->locale('fr')->isoFormat('dddd D MMMM YYYY');
        $this->notifClient(
            $seance->client_id,
            'seance',
            '❌ Séance annulée',
            "Votre séance de conduite prévue le {$dateF} à {$seance->heure_debut} a été annulée. Contactez-nous pour reprogrammer.",
            '❌',
            '#dc2626'
        );

        return response()->json(['message' => 'Séance annulée.', 'data' => $seance]);
    }
}