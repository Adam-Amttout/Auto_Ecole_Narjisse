<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\InscriptionController;

// TEST
Route::get('/test', fn() => ['message' => 'API OK']);

// AUTH
Route::post('/register-user', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// CLIENTS
Route::get('/clients', [ClientController::class, 'index']);
Route::get('/clients/{id}', [ClientController::class, 'show']);
Route::delete('/clients/{id}', [ClientController::class, 'destroy']);

// INSCRIPTIONS
Route::get('/inscriptions', [InscriptionController::class, 'index']); 
Route::post('/inscription', [InscriptionController::class, 'store']);

Route::put('/clients/{id}', [ClientController::class, 'update']);
Route::delete('/inscriptions/{id}', [InscriptionController::class, 'destroy']);
Route::put('/inscriptions/{id}', [InscriptionController::class, 'update']);

Route::post('/clients', [ClientController::class, 'store']);