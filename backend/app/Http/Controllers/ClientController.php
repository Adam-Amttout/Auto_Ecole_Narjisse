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
        $client = Client::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->password ?? '123456'),
            'role' => $request->role ?? 'user'
        ]);

        return response()->json([
            'message' => 'Client created',
            'data' => $client
        ]);
    }

    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $client->update([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'role' => $request->role
        ]);

        return response()->json([
            'message' => 'Client updated'
        ]);
    }

    public function destroy($id)
    {
        Client::destroy($id);

        return response()->json([
            'message' => 'Client deleted'
        ]);
    }
}