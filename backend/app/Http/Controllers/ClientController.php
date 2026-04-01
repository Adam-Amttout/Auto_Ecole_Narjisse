<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClientController extends Controller
{
    public function index()
    {
        return response()->json(Client::all());
    }

    public function show($id)
    {
        return response()->json(Client::findOrFail($id));
    }

    public function store(Request $request)
    {
        try {

            $validated = $request->validate([
                'nom' => 'required',
                'prenom' => 'required',
                'email' => 'required|email|unique:clients,email',
                'password' => 'nullable|min:6',
                'role' => 'nullable'
            ]);

            $client = Client::create([
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password'] ?? '123456'),
                'role' => $validated['role'] ?? 'user'
            ]);

            return response()->json([
                'message' => 'Client créé',
                'data' => $client
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {

            $client = Client::findOrFail($id);

            $validated = $request->validate([
                'nom' => 'required',
                'prenom' => 'required',
                'email' => 'required|email',
                'role' => 'nullable'
            ]);

            $client->update($validated);

            return response()->json([
                'message' => 'Client modifié'
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        Client::destroy($id);

        return response()->json([
            'message' => 'Client supprimé'
        ]);
    }
}