<?php

namespace App\Http\Controllers;

use App\Models\Vehicule;
use Illuminate\Http\Request;

class VehiculeController extends Controller
{
    /** GET /api/vehicules */
    public function index(Request $request)
    {
        $query = Vehicule::query();

        if ($request->has('disponibilite')) {
            $query->where('disponibilite', $request->disponibilite);
        }

        $vehicules = $query->orderBy('marque')->get()
            ->map(fn($v) => array_merge($v->toArray(), [
                'libelle' => $v->libelle
            ]));

        return response()->json($vehicules)
            ->header('Cache-Control', 'public, max-age=30');
    }

    /** POST /api/vehicules */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'marque'          => 'required|string|max:100',
            'modele'          => 'required|string|max:100',
            'immatriculation' => 'required|string|max:20|unique:vehicules,immatriculation',
            'disponibilite'   => 'sometimes|in:disponible,en_maintenance,hors_service',
        ]);

        $vehicule = Vehicule::create($validated);

        return response()->json([
            'message' => 'Véhicule créé',
            'data'    => $vehicule
        ], 201);
    }

    /** GET /api/vehicules/{id} */
    public function show($id)
    {
        return response()->json(Vehicule::findOrFail($id));
    }

    /** PUT /api/vehicules/{id} */
    public function update(Request $request, $id)
    {
        $vehicule = Vehicule::findOrFail($id);

        $validated = $request->validate([
            'marque'          => 'sometimes|required|string|max:100',
            'modele'          => 'sometimes|required|string|max:100',
            'immatriculation' => 'sometimes|required|string|max:20|unique:vehicules,immatriculation,' . $id,
            'disponibilite'   => 'sometimes|in:disponible,en_maintenance,hors_service',
        ]);

        $vehicule->update($validated);

        return response()->json(['message' => 'Véhicule mis à jour', 'data' => $vehicule]);
    }

    /** DELETE /api/vehicules/{id} */
    public function destroy($id)
    {
        $vehicule = Vehicule::findOrFail($id);

        $nb = $vehicule->seances()
            ->whereIn('statut', ['planifiee', 'en_cours'])
            ->count();

        if ($nb > 0) {
            return response()->json([
                'message' => "Impossible : {$nb} séance(s) en cours."
            ], 422);
        }

        $vehicule->delete();
        return response()->json(['message' => 'Véhicule supprimé']);
    }
}