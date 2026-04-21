<?php

namespace App\Http\Controllers;

use App\Models\Moniteur;
use Illuminate\Http\Request;

class MoniteurController extends Controller
{
    /** GET /api/moniteurs */
    public function index()
    {
        $moniteurs = Moniteur::where('actif', true)
            ->orderBy('nom')
            ->get()
            ->map(fn($m) => array_merge($m->toArray(), [
                'nom_complet' => $m->nom_complet
            ]));

        return response()->json($moniteurs);
    }

    /** POST /api/moniteurs */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'telephone' => 'required|string|max:20|unique:moniteurs,telephone',
            'email'     => 'required|email|unique:moniteurs,email',
        ]);

        $moniteur = Moniteur::create($validated);

        return response()->json([
            'message' => 'Moniteur créé avec succès',
            'data'    => $moniteur
        ], 201);
    }

    /** GET /api/moniteurs/{id} */
    public function show($id)
    {
        return response()->json(Moniteur::findOrFail($id));
    }

    /** PUT /api/moniteurs/{id} */
    public function update(Request $request, $id)
    {
        $moniteur = Moniteur::findOrFail($id);

        $validated = $request->validate([
            'nom'       => 'sometimes|required|string|max:100',
            'prenom'    => 'sometimes|required|string|max:100',
            'telephone' => 'sometimes|required|string|max:20|unique:moniteurs,telephone,' . $id,
            'email'     => 'sometimes|required|email|unique:moniteurs,email,' . $id,
            'actif'     => 'sometimes|boolean',
        ]);

        $moniteur->update($validated);

        return response()->json(['message' => 'Moniteur mis à jour', 'data' => $moniteur]);
    }

    /** DELETE /api/moniteurs/{id} */
    public function destroy($id)
    {
        $moniteur = Moniteur::findOrFail($id);

        $nb = $moniteur->seances()
            ->whereIn('statut', ['planifiee', 'en_cours'])
            ->count();

        if ($nb > 0) {
            return response()->json([
                'message' => "Impossible : {$nb} séance(s) planifiée(s) en cours."
            ], 422);
        }

        $moniteur->delete();
        return response()->json(['message' => 'Moniteur supprimé']);
    }
}