<?php

namespace App\Http\Controllers;

use App\Models\Avis;
use App\Models\Client;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\AvisApprovedMail;

class AvisController extends Controller
{
    /** GET /api/avis/approved */
    public function approved()
    {
        return response()->json(
            Avis::where('statut', 'approved')->orderBy('created_at', 'desc')->get()
        )->header('Cache-Control', 'public, max-age=60');
    }

    /** GET /api/avis — admin */
    public function index()
    {
        return response()->json(Avis::orderBy('created_at', 'desc')->get());
    }

    /** POST /api/avis */
    public function store(Request $request)
    {
        $v = $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'nullable|string|max:100',
            'email'      => 'nullable|email|max:150',
            'role_label' => 'nullable|string|max:150',
            'texte'      => 'required|string|max:1000',
            'note'       => 'required|integer|min:1|max:5',
            'photo_url'  => 'nullable|string|max:500',
        ]);

        $avis = Avis::create($v);

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

        $oldStatut = $avis->statut;
        $avis->update(['statut' => $request->statut]);

        // ── Email si approuvé ──
        if ($request->statut === 'approved' && $oldStatut !== 'approved' && $avis->email) {
            try {
                Mail::to($avis->email)->send(new AvisApprovedMail($avis));
            } catch (\Exception $e) {
                \Log::error("AvisApprovedMail failed: " . $e->getMessage());
            }
        }

        // ── 🔔 Notification privée si approuvé et email correspond à un client ──
        if ($request->statut === 'approved' && $oldStatut !== 'approved') {
            $client = $avis->email ? Client::where('email', $avis->email)->first() : null;
            if ($client) {
                Notification::create([
                    'client_id' => $client->id,
                    'type'      => 'avis',
                    'titre'     => '⭐ Votre avis a été approuvé !',
                    'message'   => 'Votre témoignage a été validé et publié sur notre site. Merci pour votre confiance !',
                    'icon'      => '⭐',
                    'color'     => '#d97706',
                    'lu'        => false,
                ]);
            }
        }

        return response()->json(['message' => 'Statut mis à jour', 'data' => $avis]);
    }

    /** DELETE /api/avis/{id} */
    public function destroy($id)
    {
        Avis::findOrFail($id)->delete();
        return response()->json(['message' => 'Avis supprimé']);
    }
}
