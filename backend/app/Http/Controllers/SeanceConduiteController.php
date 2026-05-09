<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Moniteur;
use App\Models\SeanceConduite;
use App\Models\Vehicule;
use Illuminate\Http\Request;

class SeanceConduiteController extends Controller
{
    /**
     * Créneaux horaires autorisés : uniquement les heures rondes de 8h à 19h
     * La séance dure 1h : heure_fin = heure_debut + 1h
     */
    private const HEURES_AUTORISEES = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00',
    ];

    /** Vérifie que l'heure est une heure ronde autorisée */
    private function heureValide(string $heure): bool
    {
        // Normaliser : "8:00" → "08:00"
        $normalized = date('H:i', strtotime($heure));
        return in_array($normalized, self::HEURES_AUTORISEES);
    }

    /** GET /api/seances */
    public function index(Request $request)
    {
        $query = SeanceConduite::with(['client', 'moniteur', 'vehicule']);

        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->has('mois') && $request->has('annee')) {
            $query->whereYear('date', $request->annee)
                  ->whereMonth('date', $request->mois);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        $seances = $query->orderBy('date')->orderBy('heure_debut')->get();

        return response()->json($seances)
            ->header('Cache-Control', 'public, max-age=30');
    }

    /** GET /api/seances/creneaux — retourne les créneaux disponibles pour une date/moniteur/vehicule */
    public function creneaux(Request $request)
    {
        $request->validate([
            'date'        => 'required|date|after_or_equal:today',
            'moniteur_id' => 'nullable|exists:moniteurs,id',
            'vehicule_id' => 'nullable|exists:vehicules,id',
        ]);

        $date        = $request->date;
        $moniteurId  = $request->moniteur_id;
        $vehiculeId  = $request->vehicule_id;

        $creneaux = [];
        foreach (self::HEURES_AUTORISEES as $heure) {
            $heureFin   = date('H:i', strtotime($heure . ' +1 hour'));
            $disponible = true;
            $placesMoniteur = Moniteur::MAX_ELEVES_PAR_CRENEAU;
            $placesVehicule  = Vehicule::MAX_ELEVES_PAR_CRENEAU;

            if ($moniteurId) {
                $moniteur = Moniteur::find($moniteurId);
                if ($moniteur) {
                    $placesMoniteur = $moniteur->placesRestantes($date, $heure, $heureFin);
                    if ($placesMoniteur === 0) $disponible = false;
                }
            }

            if ($vehiculeId) {
                $vehicule = Vehicule::find($vehiculeId);
                if ($vehicule) {
                    $placesVehicule = $vehicule->placesRestantes($date, $heure, $heureFin);
                    if ($placesVehicule === 0) $disponible = false;
                }
            }

            $creneaux[] = [
                'heure_debut'     => $heure,
                'heure_fin'       => $heureFin,
                'disponible'      => $disponible,
                'places_moniteur' => $placesMoniteur,
                'places_vehicule' => $placesVehicule,
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
            'heure_fin'   => 'required|date_format:H:i|after:heure_debut',
            'notes'       => 'nullable|string|max:500',
        ]);

        // ── Règle 1 : heure_debut doit être une heure ronde ──────────────────
        if (!$this->heureValide($validated['heure_debut'])) {
            $autorisees = implode(', ', self::HEURES_AUTORISEES);
            return response()->json([
                'message' => "L'heure de début doit être une heure ronde (ex: 8:00, 9:00…). Créneaux autorisés : {$autorisees}.",
            ], 422);
        }

        // ── Règle 2 : heure_fin = heure_debut + 1h exactement ────────────────
        $heureFin_attendue = date('H:i', strtotime($validated['heure_debut'] . ' +1 hour'));
        if ($validated['heure_fin'] !== $heureFin_attendue) {
            return response()->json([
                'message' => "La séance dure exactement 1 heure. Heure de fin attendue : {$heureFin_attendue}.",
            ], 422);
        }

        $moniteur = Moniteur::findOrFail($validated['moniteur_id']);
        $vehicule  = Vehicule::findOrFail($validated['vehicule_id']);

        // ── Règle 3 : Moniteur actif ──────────────────────────────────────────
        if (!$moniteur->actif) {
            return response()->json([
                'message' => 'Ce moniteur n\'est plus actif.',
            ], 422);
        }

        // ── Règle 4 : Moniteur a encore de la place (< 3 élèves) ─────────────
        if (!$moniteur->estDisponible($validated['date'], $validated['heure_debut'], $validated['heure_fin'])) {
            $max = Moniteur::MAX_ELEVES_PAR_CRENEAU;
            return response()->json([
                'message' => "Ce moniteur a déjà atteint le maximum de {$max} élèves sur ce créneau. Choisissez un autre horaire ou moniteur.",
            ], 422);
        }

        // ── Règle 5 : Véhicule a encore de la place (< 3 élèves) ────────────
        if (!$vehicule->estDisponible($validated['date'], $validated['heure_debut'], $validated['heure_fin'])) {
            if ($vehicule->disponibilite !== 'disponible') {
                return response()->json([
                    'message' => 'Ce véhicule est en maintenance ou hors service.',
                ], 422);
            }
            $max = Vehicule::MAX_ELEVES_PAR_CRENEAU;
            return response()->json([
                'message' => "Ce véhicule a déjà atteint le maximum de {$max} élèves sur ce créneau. Choisissez un autre horaire ou véhicule.",
            ], 422);
        }

        // ── Règle 6 : L'élève n'a pas déjà une séance sur ce créneau ─────────
        $conflitEleve = SeanceConduite::where('client_id', $validated['client_id'])
            ->where('date', $validated['date'])
            ->where('statut', '!=', 'annulee')
            ->where('heure_debut', '<', $validated['heure_fin'])
            ->where('heure_fin',   '>', $validated['heure_debut'])
            ->exists();

        if ($conflitEleve) {
            return response()->json([
                'message' => 'Cet élève a déjà une séance planifiée sur ce créneau.',
            ], 422);
        }

        $seance = SeanceConduite::create($validated);
        $seance->load(['client', 'moniteur', 'vehicule']);

        // Calculer les places restantes après création
        $placesMoniteur = $moniteur->placesRestantes($validated['date'], $validated['heure_debut'], $validated['heure_fin']);
        $placesVehicule  = $vehicule->placesRestantes($validated['date'], $validated['heure_debut'], $validated['heure_fin']);

        return response()->json([
            'message'         => 'Séance planifiée avec succès !',
            'data'            => $seance,
            'places_restantes' => [
                'moniteur' => $placesMoniteur,
                'vehicule' => $placesVehicule,
            ],
        ], 201);
    }

    /** GET /api/seances/{id} */
    public function show($id)
    {
        $seance = SeanceConduite::with(['client', 'moniteur', 'vehicule'])->findOrFail($id);
        return response()->json($seance);
    }

    /** PUT /api/seances/{id} */
    public function update(Request $request, $id)
    {
        $seance = SeanceConduite::findOrFail($id);

        if (!in_array($seance->statut, ['planifiee'])) {
            return response()->json([
                'message' => 'Seules les séances planifiées peuvent être modifiées.',
            ], 422);
        }

        $validated = $request->validate([
            'moniteur_id' => 'sometimes|required|exists:moniteurs,id',
            'vehicule_id' => 'sometimes|required|exists:vehicules,id',
            'date'        => 'sometimes|required|date|after_or_equal:today',
            'heure_debut' => 'sometimes|required|date_format:H:i',
            'heure_fin'   => 'sometimes|required|date_format:H:i|after:heure_debut',
            'statut'      => 'sometimes|in:planifiee,en_cours,terminee,annulee',
            'notes'       => 'nullable|string|max:500',
        ]);

        $date       = $validated['date']        ?? $seance->date->format('Y-m-d');
        $heureDebut = $validated['heure_debut'] ?? $seance->heure_debut;
        $heureFin   = $validated['heure_fin']   ?? $seance->heure_fin;
        $moniteurId = $validated['moniteur_id'] ?? $seance->moniteur_id;
        $vehiculeId = $validated['vehicule_id'] ?? $seance->vehicule_id;

        // ── Vérification heure ronde si modifiée ──────────────────────────────
        if (isset($validated['heure_debut']) && !$this->heureValide($heureDebut)) {
            return response()->json([
                'message' => "L'heure de début doit être une heure ronde (8:00, 9:00, 10:00…).",
            ], 422);
        }

        $moniteur = Moniteur::findOrFail($moniteurId);
        if (!$moniteur->estDisponible($date, $heureDebut, $heureFin, $seance->id)) {
            $max = Moniteur::MAX_ELEVES_PAR_CRENEAU;
            return response()->json([
                'message' => "Ce moniteur a déjà {$max} élèves sur ce créneau.",
            ], 422);
        }

        $vehicule = Vehicule::findOrFail($vehiculeId);
        if (!$vehicule->estDisponible($date, $heureDebut, $heureFin, $seance->id)) {
            if ($vehicule->disponibilite !== 'disponible') {
                return response()->json(['message' => 'Véhicule indisponible.'], 422);
            }
            $max = Vehicule::MAX_ELEVES_PAR_CRENEAU;
            return response()->json([
                'message' => "Ce véhicule a déjà {$max} élèves sur ce créneau.",
            ], 422);
        }

        $seance->update($validated);
        $seance->load(['client', 'moniteur', 'vehicule']);

        return response()->json([
            'message' => 'Séance mise à jour.',
            'data'    => $seance,
        ]);
    }

    /** DELETE /api/seances/{id} */
    public function destroy($id)
    {
        $seance = SeanceConduite::findOrFail($id);

        if (in_array($seance->statut, ['en_cours', 'terminee'])) {
            return response()->json([
                'message' => 'Impossible de supprimer une séance en cours ou terminée.',
            ], 422);
        }

        $seance->delete();
        return response()->json(['message' => 'Séance supprimée.']);
    }

    /** PATCH /api/seances/{id}/annuler */
    public function annuler($id)
    {
        $seance = SeanceConduite::findOrFail($id);

        if ($seance->statut === 'terminee') {
            return response()->json(['message' => 'Séance déjà terminée.'], 422);
        }

        $seance->update(['statut' => 'annulee']);
        return response()->json(['message' => 'Séance annulée.', 'data' => $seance]);
    }
}