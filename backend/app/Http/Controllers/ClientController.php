<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    // Créer un client
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'cin' => 'required|string|unique:clients,cin',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $client = Client::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'cin' => $request->cin,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['success' => true, 'message' => 'Client créé !']);
    }

    // Lister tous les clients
    public function index()
    {
        $clients = Client::all();
        return response()->json($clients);
    }
}