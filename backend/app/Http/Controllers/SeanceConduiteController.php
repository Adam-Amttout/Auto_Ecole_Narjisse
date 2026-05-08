<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Moniteur;
use App\Models\SeanceConduite;
use App\Models\Vehicule;
use Illuminate\Http\Request;

class SeanceConduiteController extends Controller
{
    /** GET /api/seances */
    public function index(Request $request)
    {
        $query = SeanceConduite::with(['client', 'moniteur', 'vehicule']);

        // Filtre par client (pour qu'un élève ne voie que ses séances)
        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        // Filtre par mois/année (pour le calendrier)
        if ($request->has('mois') && $request->has('annee')) {
            $query->whereYear('date', $request->annee)
                  ->whereMonth('date', $request->mois);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        $seances = $query->orderBy('date')->orderBy('heure_debut')->get();

        return response()->json($seances);
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

        $moniteur = Moniteur::findOrFail($validated['moniteur_id']);
        $vehicule  = Vehicule::findOrFail($validated['vehicule_id']);

        // 1. Moniteur actif ?
        if (!$moniteur->actif) {
            return response()->json([
                'message' => 'Ce moniteur n\'est plus actif.'
            ], 422);
        }

        // 2. Moniteur disponible ?
        if (!$moniteur->estDisponible($validated['date'], $validated['heure_debut'], $validated['heure_fin'])) {
            return response()->json([
                'message' => 'Conflit d\'horaire : le moniteur a déjà une séance sur ce créneau.'
            ], 422);
        }

        // 3. Véhicule disponible ?
        if (!$vehicule->estDisponible($validated['date'], $validated['heure_debut'], $validated['heure_fin'])) {
            return response()->json([
                'message' => $vehicule->disponibilite !== 'disponible'
                    ? 'Ce véhicule est en maintenance ou hors service.'
                    : 'Conflit d\'horaire : ce véhicule est déjà réservé sur ce créneau.'
            ], 422);
        }

        // 4. L'élève n'a pas déjà une séance sur ce créneau ?
        $conflitEleve = SeanceConduite::where('client_id', $validated['client_id'])
            ->where('date', $validated['date'])
            ->where('statut', '!=', 'annulee')
            ->where('heure_debut', '<', $validated['heure_fin'])
            ->where('heure_fin', '>', $validated['heure_debut'])
            ->exists();

        if ($conflitEleve) {
            return response()->json([
                'message' => 'Vous avez déjà une séance planifiée sur ce créneau.'
            ], 422);
        }

        $seance = SeanceConduite::create($validated);
        $seance->load(['client', 'moniteur', 'vehicule']);

        return response()->json([
            'message' => 'Séance planifiée avec succès !',
            'data'    => $seance
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
                'message' => 'Seules les séances planifiées peuvent être modifiées.'
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

        $moniteur = Moniteur::findOrFail($moniteurId);
        if (!$moniteur->estDisponible($date, $heureDebut, $heureFin, $seance->id)) {
            return response()->json([
                'message' => 'Conflit d\'horaire pour le moniteur.'
            ], 422);
        }

        $vehicule = Vehicule::findOrFail($vehiculeId);
        if (!$vehicule->estDisponible($date, $heureDebut, $heureFin, $seance->id)) {
            return response()->json([
                'message' => 'Conflit d\'horaire pour le véhicule.'
            ], 422);
        }

        $seance->update($validated);
        $seance->load(['client', 'moniteur', 'vehicule']);

        return response()->json([
            'message' => 'Séance mise à jour.',
            'data'    => $seance
        ]);
    }

    /** DELETE /api/seances/{id} */
    public function destroy($id)
    {
        $seance = SeanceConduite::findOrFail($id);

        if (in_array($seance->statut, ['en_cours', 'terminee'])) {
            return response()->json([
                'message' => 'Impossible de supprimer une séance en cours ou terminée.'
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