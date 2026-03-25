<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        // ✅ validation
        $data = $request->validate([
            'nom' => 'required',
            'email' => 'required|email',
            'message' => 'required'
        ]);

        // ✅ send email (Mailtrap)
        Mail::raw(
            "Nom: " . $data['nom'] . "\n" .
            "Email: " . $data['email'] . "\n" .
            "Message: " . $data['message'],
            function ($message) {
                $message->to('adilaitelmoudden44@gmail.com')
                        ->subject('Message Client Auto Ecole');
            }
        );

        // ✅ response
        return response()->json([
            'success' => true,
            'message' => 'Email envoyé avec succès'
        ]);
    }
}