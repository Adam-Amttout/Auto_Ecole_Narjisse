<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ContactMessage;
use App\Models\Notification;
use App\Mail\ReponseContact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactMessageController extends Controller
{
    /** GET /api/contact-messages */
    public function index()
    {
        return response()->json(
            ContactMessage::orderBy('created_at', 'desc')->get()
        );
    }

    /** POST /api/contact */
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

    /** PATCH /api/contact-messages/{id}/lire */
    public function marquerLu($id)
    {
        $msg = ContactMessage::findOrFail($id);
        $msg->update([
            'lu'     => true,
            'statut' => $msg->statut === 'nouveau' ? 'lu' : $msg->statut,
        ]);
        return response()->json(['message' => 'Marqué comme lu.', 'data' => $msg]);
    }

    /** POST /api/contact-messages/{id}/repondre */
    public function repondre(Request $request, $id)
    {
        $msg = ContactMessage::findOrFail($id);
        $request->validate(['reponse' => 'required|string|max:5000']);
        $reponse = $request->input('reponse');

        // Envoyer l'email
        try {
            Mail::to($msg->email)->send(new ReponseContact($msg, $reponse));
        } catch (\Exception $e) {
            $msg->update([
                'reponse_admin' => $reponse,
                'repondu_le'    => now(),
                'lu'            => true,
                'statut'        => 'repondu',
            ]);

            // 🔔 Notification privée même si email échoue
            $this->envoyerNotifReponse($msg);

            return response()->json([
                'message'      => 'Réponse enregistrée mais email non envoyé (vérifiez la config mail).',
                'email_erreur' => $e->getMessage(),
                'data'         => $msg,
            ], 207);
        }

        $msg->update([
            'reponse_admin' => $reponse,
            'repondu_le'    => now(),
            'lu'            => true,
            'statut'        => 'repondu',
        ]);

        // 🔔 Notification privée au client
        $this->envoyerNotifReponse($msg);

        return response()->json([
            'message' => 'Réponse envoyée par email avec succès !',
            'data'    => $msg,
        ]);
    }

    /** Envoie une notification privée si le client a un compte */
    private function envoyerNotifReponse($msg): void
    {
        $client = Client::where('email', $msg->email)->first();
        if ($client) {
            Notification::create([
                'client_id' => $client->id,
                'type'      => 'message',
                'titre'     => '💬 Réponse de l\'administration',
                'message'   => 'L\'équipe Auto École Narjiss a répondu à votre message' . ($msg->sujet ? ' concernant : ' . $msg->sujet : '') . '. Consultez votre email.',
                'icon'      => '💬',
                'color'     => '#7c3aed',
                'lu'        => false,
            ]);
        }
    }

    /** PATCH /api/contact-messages/{id}/archiver */
    public function archiver($id)
    {
        $msg = ContactMessage::findOrFail($id);
        $msg->update(['statut' => 'archive']);
        return response()->json(['message' => 'Message archivé.', 'data' => $msg]);
    }

    /** DELETE /api/contact-messages/{id} */
    public function destroy($id)
    {
        ContactMessage::findOrFail($id)->delete();
        return response()->json(['message' => 'Message supprimé.']);
    }
}