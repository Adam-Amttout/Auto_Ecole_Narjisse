<?php
// routes/api.php — COMPLET

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\CoursController;
use App\Http\Controllers\MoniteurController;
use App\Http\Controllers\VehiculeController;
use App\Http\Controllers\SeanceConduiteController;
use App\Http\Controllers\AvisController;
use App\Http\Controllers\ProgressionController;
use App\Http\Controllers\QcmController;

Route::get('/test', fn() => ['message' => 'API Narjiss OK']);

// ── AUTH
Route::post('/register-user', [AuthController::class, 'register']);
Route::post('/login',         [AuthController::class, 'login']);

// ── CLIENTS
Route::get('/clients',         [ClientController::class, 'index']);
Route::get('/clients/{id}',    [ClientController::class, 'show']);
Route::post('/clients',        [ClientController::class, 'store']);
Route::put('/clients/{id}',    [ClientController::class, 'update']);
Route::delete('/clients/{id}', [ClientController::class, 'destroy']);

// ── INSCRIPTIONS
Route::get('/inscriptions',          [InscriptionController::class, 'index']);
Route::post('/inscription',          [InscriptionController::class, 'store']);
Route::put('/inscriptions/{id}',     [InscriptionController::class, 'update']);
Route::delete('/inscriptions/{id}',  [InscriptionController::class, 'destroy']);

// ── COURS
Route::get('/cours/all',     [CoursController::class, 'all']);    // admin
Route::get('/cours',         [CoursController::class, 'index']);   // public (actifs)
Route::get('/cours/{id}',    [CoursController::class, 'show']);
Route::post('/cours',        [CoursController::class, 'store']);
Route::put('/cours/{id}',    [CoursController::class, 'update']);
Route::delete('/cours/{id}', [CoursController::class, 'destroy']);

// ── MONITEURS
Route::get('/moniteurs',          [MoniteurController::class, 'index']);
Route::get('/moniteurs/{id}',     [MoniteurController::class, 'show']);
Route::post('/moniteurs',         [MoniteurController::class, 'store']);
Route::put('/moniteurs/{id}',     [MoniteurController::class, 'update']);
Route::delete('/moniteurs/{id}',  [MoniteurController::class, 'destroy']);

// ── VÉHICULES
Route::get('/vehicules',          [VehiculeController::class, 'index']);
Route::get('/vehicules/{id}',     [VehiculeController::class, 'show']);
Route::post('/vehicules',         [VehiculeController::class, 'store']);
Route::put('/vehicules/{id}',     [VehiculeController::class, 'update']);
Route::delete('/vehicules/{id}',  [VehiculeController::class, 'destroy']);

// ── SÉANCES
Route::get('/seances',                [SeanceConduiteController::class, 'index']);
Route::get('/seances/{id}',           [SeanceConduiteController::class, 'show']);
Route::post('/seances',               [SeanceConduiteController::class, 'store']);
Route::put('/seances/{id}',           [SeanceConduiteController::class, 'update']);
Route::delete('/seances/{id}',        [SeanceConduiteController::class, 'destroy']);
Route::patch('/seances/{id}/annuler', [SeanceConduiteController::class, 'annuler']);

// ── AVIS (reviews)
Route::get('/avis/approved',          [AvisController::class, 'approved']);   // public
Route::get('/avis',                   [AvisController::class, 'index']);       // admin
Route::post('/avis',                  [AvisController::class, 'store']);       // submit
Route::patch('/avis/{id}/statut',     [AvisController::class, 'updateStatut']); // admin
Route::delete('/avis/{id}',           [AvisController::class, 'destroy']);     // admin

// ── PROGRESSION (suivi de cours)
Route::get('/progression',              [ProgressionController::class, 'index']);       // ?client_id=X
Route::get('/progression/by-category',  [ProgressionController::class, 'byCategory']); // ?client_id=X
Route::post('/progression/toggle',      [ProgressionController::class, 'toggle']);      // toggle done/undone

// ── QCM (quiz code de la route)
Route::get('/qcm/questions', [QcmController::class, 'random']); // ?categorie=code_route&limit=12