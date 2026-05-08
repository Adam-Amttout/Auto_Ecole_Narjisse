<?php

namespace App\Http\Controllers;

use App\Models\Avis;
use Illuminate\Http\Request;

class AvisController extends Controller
{
    /** GET /api/avis/approved — public: approved reviews for Gallery */
    public function approved()
    {
        return response()->json(
            Avis::where('statut', 'approved')
                ->orderBy('created_at', 'desc')
                ->get()
        )->header('Cache-Control', 'public, max-age=60');
    }

    /** GET /api/avis — admin: all reviews */
    public function index()
    {
        return response()->json(
            Avis::orderBy('created_at', 'desc')->get()
        );
    }

    /** POST /api/avis — submit a review */
    public function store(Request $request)
    {
        $v = $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'nullable|string|max:100',
            'role_label' => 'nullable|string|max:150',
            'texte'      => 'required|string|max:1000',
            'note'       => 'required|integer|min:1|max:5',
            'photo_url'  => 'nullable|string|max:500',
        ]);

        $avis = Avis::create($v); // statut = pending by default

        return response()->json([
            'message' => 'Avis soumis avec succès. En attente de validation.',
            'data'    => $avis
        ], 201);
    }

    /** PATCH /api/avis/{id}/statut — admin: approve or reject */
    public function updateStatut(Request $request, $id)
    {
        $avis = Avis::findOrFail($id);
        $request->validate(['statut' => 'required|in:approved,rejected,pending']);
        $avis->update(['statut' => $request->statut]);
        return response()->json(['message' => 'Statut mis à jour', 'data' => $avis]);
    }

    /** DELETE /api/avis/{id} — admin: delete */
    public function destroy($id)
    {
        Avis::findOrFail($id)->delete();
        return response()->json(['message' => 'Avis supprimé']);
    }
}
