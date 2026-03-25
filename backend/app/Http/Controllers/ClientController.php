<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;

class ClientController extends Controller
{
    // Create client
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required',
            'prenom' => 'required',
            'email' => 'required|email'
        ]);

        $client = Client::create($request->all());

        return response()->json([
            'success' => true,
            'client' => $client
        ]);
    }

    // Get all clients
    public function index()
    {
        return response()->json(Client::all());
    }
}