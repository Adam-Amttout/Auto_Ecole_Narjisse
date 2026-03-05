<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Ici, tu définis toutes les routes API de ton application.
|
*/

// Route de test simple GET
Route::get('/test-connection', function () {
    return response()->json([
        'success' => true,
        'message' => 'GET fonctionne !'
    ]);
});

// Routes Clients
Route::prefix('clients')->group(function () {
    // Créer un client (POST)
    Route::post('/', [ClientController::class, 'store']);

    // Lister tous les clients (GET)
    Route::get('/', [ClientController::class, 'index']);
});

// Route pour React: POST /api/register (si tu veux garder ton ancien composant)
Route::post('/register', [ClientController::class, 'store']);