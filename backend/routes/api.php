<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🔹 Test GET
Route::get('/test-connection', function () {
    return response()->json([
        'success' => true,
        'message' => 'GET fonctionne !'
    ]);
});

// 🔹 Clients
Route::prefix('clients')->group(function () {

    // Create client
    Route::post('/', [ClientController::class, 'store']);

    // Get all clients
    Route::get('/', [ClientController::class, 'index']);
});

// 🔹 Register (optionnel)
Route::post('/register', [ClientController::class, 'store']);

// 🔹 Contact (email)
Route::post('/contact', [ContactController::class, 'send']);