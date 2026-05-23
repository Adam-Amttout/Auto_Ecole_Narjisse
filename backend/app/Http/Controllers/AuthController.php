<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Moniteur;
use App\Models\Notification;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ✅ REGISTER (client public)
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

        Notification::create([
            'client_id' => $client->id,
            'type'      => 'bienvenue',
            'titre'     => '👋 Bienvenue ' . $client->prenom . ' !',
            'message'   => 'Votre compte a été créé avec succès. Bienvenue dans votre espace Auto École Narjiss !',
            'icon'      => '👋',
            'color'     => '#059669',
            'lu'        => false,
        ]);

        return response()->json(['status' => 'created', 'user' => $client]);
    }

    // 🔥 LOGIN
    public function login(Request $request)
    {
        $client = Client::where('email', $request->email)->first();
        if (!$client) return response()->json(['status' => 'not_found'], 404);
        if (!Hash::check($request->password, $client->password)) return response()->json(['status' => 'wrong_password'], 401);
        return response()->json(['status' => 'success', 'user' => $client]);
    }

    // 🧑‍🏫 CRÉER UN COMPTE MONITEUR (admin only)
    public function registerMoniteur(Request $request)
    {
        $validated = $request->validate([
            'nom'      => 'required|string|max:100',
            'prenom'   => 'required|string|max:100',
            'email'    => 'required|email|unique:clients,email',
            'password' => 'required|min:6',
            'telephone'=> 'nullable|string|max:20',
        ]);

        // 1️⃣ Compte client avec role=moniteur
        $client = Client::create([
            'nom'      => $validated['nom'],
            'prenom'   => $validated['prenom'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'telephone'=> $validated['telephone'] ?? null,
            'role'     => 'moniteur',
        ]);

        // 2️⃣ Entrée dans la table moniteurs (pour lier les séances)
        $tel = $validated['telephone'] ?? ('0600' . str_pad($client->id, 6, '0', STR_PAD_LEFT));
        Moniteur::firstOrCreate(
            ['email' => $validated['email']],
            ['nom' => $validated['nom'], 'prenom' => $validated['prenom'], 'telephone' => $tel, 'actif' => true]
        );

        // 3️⃣ Notification de bienvenue
        Notification::create([
            'client_id' => $client->id,
            'type'      => 'bienvenue',
            'titre'     => '🧑‍🏫 Bienvenue Moniteur ' . $client->prenom . ' !',
            'message'   => 'Votre compte moniteur a été créé par l\'administrateur. Connectez-vous pour accéder à votre tableau de bord.',
            'icon'      => '🧑‍🏫',
            'color'     => '#0891b2',
            'lu'        => false,
        ]);

        return response()->json(['status' => 'created', 'user' => $client], 201);
    }

    // 🔄 CHANGER LE RÔLE D'UN CLIENT (admin only)
    public function updateRole(Request $request, $id)
    {
        $validated = $request->validate(['role' => 'required|in:user,moniteur,admin']);

        $client = Client::findOrFail($id);
        $client->role = $validated['role'];
        $client->save();

        // Si le nouveau rôle est moniteur → auto-créer l'entrée dans moniteurs
        if ($validated['role'] === 'moniteur') {
            $tel = $client->telephone ?? ('0600' . str_pad($client->id, 6, '0', STR_PAD_LEFT));
            Moniteur::firstOrCreate(
                ['email' => $client->email],
                ['nom' => $client->nom, 'prenom' => $client->prenom, 'telephone' => $tel, 'actif' => true]
            );
        }

        $roleLabels = ['user' => 'Client', 'moniteur' => 'Moniteur', 'admin' => 'Administrateur'];
        $roleColors = ['user' => '#1d4ed8', 'moniteur' => '#0891b2', 'admin' => '#b91c1c'];

        Notification::create([
            'client_id' => $client->id,
            'type'      => 'role',
            'titre'     => '🔄 Votre rôle a été mis à jour',
            'message'   => 'Votre rôle est maintenant : ' . ($roleLabels[$validated['role']] ?? $validated['role']) . '.',
            'icon'      => '🔄',
            'color'     => $roleColors[$validated['role']] ?? '#1d4ed8',
            'lu'        => false,
        ]);

        return response()->json(['message' => 'Rôle mis à jour avec succès.', 'user' => $client]);
    }
}