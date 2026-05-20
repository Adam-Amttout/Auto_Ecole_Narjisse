<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inscription;
use App\Models\Client;

class InscriptionController extends Controller
{
    public function index()
    {
        return response()->json(
            Inscription::with('client')->get()
        )->header('Cache-Control', 'public, max-age=30');
    }

    public function store(Request $request)
    {
        $client = Client::where('email', $request->email)->first();

        if (!$client) {
            return response()->json([
                'message' => 'Client not found'
            ], 404);
        }

        $inscription = Inscription::create([
            'client_id' => $client->id,
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'sujet' => $request->sujet,
            'message' => $request->message
        ]);

        return response()->json([
            'message' => 'Inscription réussie',
            'data' => $inscription
        ]);
    }

    public function destroy($id)
    {
        $inscription = Inscription::findOrFail($id);
        $inscription->delete();
        return response()->json(['message' => 'Inscription supprimée.']);
    }
}