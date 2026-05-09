<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClientController extends Controller
{
    public function index()
    {
        $clients = \App\Models\Client::orderBy('created_at', 'desc')->get();
        return response()->json($clients)
            ->header('Cache-Control', 'public, max-age=30');
    }

    public function show($id)
    {
        return response()->json(Client::findOrFail($id));
    }

    public function store(Request $request)
    {
        $client = Client::create([
            'nom'      => $request->nom,
            'prenom'   => $request->prenom,
            'email'    => $request->email,
            'password' => Hash::make($request->password ?? '123456'),
            'role'     => $request->role ?? 'user',
        ]);

        return response()->json([
            'message' => 'Client créé',
            'data'    => $client
        ]);
    }

    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $data = [
            'nom'    => $request->nom    ?? $client->nom,
            'prenom' => $request->prenom ?? $client->prenom,
            'email'  => $request->email  ?? $client->email,
            'role'   => $request->role   ?? $client->role,
        ];

        // Hash le mot de passe seulement s'il est fourni et non vide
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $client->update($data);

        return response()->json([
            'message' => 'Client mis à jour',
            'data'    => $client
        ]);
    }

    public function updatePhoto(Request $request, $id)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $client = Client::findOrFail($id);

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($client->photo_profil && \Illuminate\Support\Facades\Storage::disk('public')->exists($client->photo_profil)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($client->photo_profil);
            }

            $path = $request->file('photo')->store('profils', 'public');
            $client->photo_profil = $path;
            $client->save();

            return response()->json([
                'message' => 'Photo mise à jour',
                'photo_url' => asset('storage/' . $path),
                'photo_profil' => $path
            ]);
        }

        return response()->json(['message' => 'Aucune photo fournie'], 400);
    }

    public function destroy($id)
    {
        Client::destroy($id);

        return response()->json(['message' => 'Client supprimé']);
    }
}