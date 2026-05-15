<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Notification;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ✅ REGISTER
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nom'      => 'required',
            'prenom'   => 'required',
            'email'    => 'required|email|unique:clients,email',
            'password' => 'required|min:6|confirmed'
        ]);

        $client = Client::create([
            'nom'      => $validated['nom'],
            'prenom'   => $validated['prenom'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'user'
        ]);

        // 🔔 Notification de bienvenue privée
        Notification::create([
            'client_id' => $client->id,
            'type'      => 'bienvenue',
            'titre'     => '👋 Bienvenue ' . $client->prenom . ' !',
            'message'   => 'Votre compte a été créé avec succès. Bienvenue dans votre espace Auto École Narjiss ! Vous pouvez dès maintenant accéder à vos cours, planifier des séances et passer des quiz.',
            'icon'      => '👋',
            'color'     => '#059669',
            'lu'        => false,
        ]);

        return response()->json([
            'status' => 'created',
            'user'   => $client
        ]);
    }

    // 🔥 LOGIN
    public function login(Request $request)
    {
        $client = Client::where('email', $request->email)->first();

        if (!$client) {
            return response()->json(['status' => 'not_found'], 404);
        }

        if (!Hash::check($request->password, $client->password)) {
            return response()->json(['status' => 'wrong_password'], 401);
        }

        return response()->json([
            'status' => 'success',
            'user'   => $client
        ]);
    }
}