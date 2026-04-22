<?php
// app/Http/Controllers/CoursController.php

namespace App\Http\Controllers;

use App\Models\Cours;
use Illuminate\Http\Request;

class CoursController extends Controller
{
    /** GET /api/cours */
    public function index()
    {
        return response()->json(
            Cours::where('actif', true)
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    /** GET /api/cours/all  (admin : tous y compris inactifs) */
    public function all()
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
        $v = $request->validate([
            'titre'          => 'required|string|max:200',
            'description'    => 'nullable|string',
            'categorie'      => 'required|in:danger,indication,interdiction,code_route,conduite,autre',
            'niveau'         => 'required|in:debutant,intermediaire,avance',
            'image'          => 'nullable|string|max:500',
            'video_url'      => 'nullable|string|max:500',
            'contenu'        => 'nullable|string',
            'pdf_url'        => 'nullable|string|max:500',
            'duree_minutes'  => 'nullable|integer|min:1|max:480',
            'actif'          => 'sometimes|boolean',
        ]);

        $cours = Cours::create($v);

        return response()->json([
            'message' => 'Cours créé avec succès',
            'data'    => $cours
        ], 201);
    }

    /** PUT /api/cours/{id} */
    public function update(Request $request, $id)
    {
        $cours = Cours::findOrFail($id);

        $v = $request->validate([
            'titre'          => 'sometimes|required|string|max:200',
            'description'    => 'nullable|string',
            'categorie'      => 'sometimes|in:danger,indication,interdiction,code_route,conduite,autre',
            'niveau'         => 'sometimes|in:debutant,intermediaire,avance',
            'image'          => 'nullable|string|max:500',
            'video_url'      => 'nullable|string|max:500',
            'contenu'        => 'nullable|string',
            'pdf_url'        => 'nullable|string|max:500',
            'duree_minutes'  => 'nullable|integer|min:1|max:480',
            'actif'          => 'sometimes|boolean',
        ]);

        $cours->update($v);

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