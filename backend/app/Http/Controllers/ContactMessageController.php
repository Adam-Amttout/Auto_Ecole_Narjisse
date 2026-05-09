<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Mail\ReponseContact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactMessageController extends Controller
{
    /** GET /api/contact-messages — admin: tous les messages triés */
    public function index()
    {
        return response()->json(
            ContactMessage::orderBy('created_at', 'desc')->get()
        );
    }

    /** POST /api/contact — public: envoyer un message */
    public function store(Request $request)
    {
        $v = $request->validate([
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => 'required|email|max:255',
            'telephone' => 'nullable|string|max:30',
            'sujet'     => 'nullable|string|max:200',
            'message'   => 'required|string|max:3000',
        ]);

        $msg = ContactMessage::create(array_merge($v, [
            'lu'     => false,
            'statut' => 'nouveau',
        ]));

        return response()->json([
            'message' => 'Message envoyé avec succès. Nous vous répondrons bientôt.',
            'data'    => $msg
        ], 201);
    }

    /** PATCH /api/contact-messages/{id}/lire — admin: marquer comme lu */
    public function marquerLu($id)
    {
        $msg = ContactMessage::findOrFail($id);
        $msg->update([
            'lu'     => true,
            'statut' => $msg->statut === 'nouveau' ? 'lu' : $msg->statut,
        ]);
        return response()->json(['message' => 'Marqué comme lu.', 'data' => $msg]);
    }

    /**
     * POST /api/contact-messages/{id}/repondre
     * Admin envoie une réponse par email au client
     */
    public function repondre(Request $request, $id)
    {
        $msg = ContactMessage::findOrFail($id);

        $request->validate([
            'reponse' => 'required|string|max:5000',
        ]);

        $reponse = $request->input('reponse');

        // Envoyer l'email via Laravel Mail
        try {
            Mail::to($msg->email)
                ->send(new ReponseContact($msg, $reponse));
        } catch (\Exception $e) {
            // Si l'email échoue (config mail non faite), on enregistre quand même la réponse
            // mais on informe l'admin
            $msg->update([
                'reponse_admin' => $reponse,
                'repondu_le'    => now(),
                'lu'            => true,
                'statut'        => 'repondu',
            ]);
            return response()->json([
                'message'      => 'Réponse enregistrée mais email non envoyé (vérifiez la configuration mail dans .env).',
                'email_erreur' => $e->getMessage(),
                'data'         => $msg,
            ], 207); // 207 = partial success
        }

        // Sauvegarder la réponse en BDD
        $msg->update([
            'reponse_admin' => $reponse,
            'repondu_le'    => now(),
            'lu'            => true,
            'statut'        => 'repondu',
        ]);

        return response()->json([
            'message' => 'Réponse envoyée par email avec succès !',
            'data'    => $msg,
        ]);
    }

    /** PATCH /api/contact-messages/{id}/archiver — admin: archiver */
    public function archiver($id)
    {
        $msg = ContactMessage::findOrFail($id);
        $msg->update(['statut' => 'archive']);
        return response()->json(['message' => 'Message archivé.', 'data' => $msg]);
    }

    /** DELETE /api/contact-messages/{id} — admin: supprimer */
    public function destroy($id)
    {
        ContactMessage::findOrFail($id)->delete();
        return response()->json(['message' => 'Message supprimé.']);
    }
}