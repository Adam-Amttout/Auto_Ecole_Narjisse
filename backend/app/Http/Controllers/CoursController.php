<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use Illuminate\Http\Request;

class CoursController extends Controller
{
    /** GET /api/cours */
    public function index()
    {
        return response()->json(Cours::orderBy('created_at', 'desc')->get());
    }

    /** GET /api/cours/{id} */
    public function show($id)
    {
        return response()->json(Cours::findOrFail($id));
    }

    /** POST /api/cours */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre'       => 'required|string|max:200',
            'description' => 'nullable|string',
            'categorie'   => 'required|in:danger,indication,interdiction,autre',
            'image'       => 'nullable|string|max:500',
            'niveau'      => 'required|in:debutant,intermediaire,avance',
        ]);

        $cours = Cours::create($validated);

        return response()->json([
            'message' => 'Cours créé avec succès',
            'data'    => $cours
        ], 201);
    }

    /** PUT /api/cours/{id} */
    public function update(Request $request, $id)
    {
        $cours = Cours::findOrFail($id);

        $validated = $request->validate([
            'titre'       => 'sometimes|required|string|max:200',
            'description' => 'nullable|string',
            'categorie'   => 'sometimes|in:danger,indication,interdiction,autre',
            'image'       => 'nullable|string|max:500',
            'niveau'      => 'sometimes|in:debutant,intermediaire,avance',
            'actif'       => 'sometimes|boolean',
        ]);

        $cours->update($validated);

        return response()->json([
            'message' => 'Cours mis à jour',
            'data'    => $cours
        ]);
    }

    /** DELETE /api/cours/{id} */
    public function destroy($id)
    {
        Cours::findOrFail($id)->delete();

        return response()->json(['message' => 'Cours supprimé']);
    }
}