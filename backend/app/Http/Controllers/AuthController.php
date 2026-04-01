<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ✅ REGISTER
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required',
            'prenom' => 'required',
            'email' => 'required|email|unique:clients,email',
            'password' => 'required|min:6|confirmed'
        ]);

        $client = Client::create([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user'
        ]);

        return response()->json([
            'status' => 'created',
            'user' => $client
        ]);
    }

    // 🔥 LOGIN (هذا هو المهم)
    public function login(Request $request)
    {
        $client = Client::where('email', $request->email)->first();

        // ❌ user ما كاينش
        if (!$client) {
            return response()->json([
                'status' => 'not_found'
            ], 404);
        }

        // ❌ password غلط
        if (!Hash::check($request->password, $client->password)) {
            return response()->json([
                'status' => 'wrong_password'
            ], 401);
        }

        // ✅ success
        return response()->json([
            'status' => 'success',
            'user' => $client
        ]);
    }
}