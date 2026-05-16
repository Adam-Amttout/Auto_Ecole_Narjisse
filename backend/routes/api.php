<?php

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
use App\Http\Controllers\FaqController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ExamController;


// ── TEST
Route::get('/test', fn() => ['message' => 'API Narjiss OK']);

// ── AUTH
Route::post('/register-user', [AuthController::class, 'register']);
Route::post('/login',         [AuthController::class, 'login']);

// ── CLIENTS
Route::get('/clients',         [ClientController::class, 'index']);
Route::get('/clients/{id}',    [ClientController::class, 'show']);
Route::post('/clients',        [ClientController::class, 'store']);
Route::put('/clients/{id}',    [ClientController::class, 'update']);
Route::post('/clients/{id}/photo', [ClientController::class, 'updatePhoto']);
Route::delete('/clients/{id}', [ClientController::class, 'destroy']);

// ── INSCRIPTIONS
Route::get('/inscriptions',          [InscriptionController::class, 'index']);
Route::post('/inscription',          [InscriptionController::class, 'store']);
Route::put('/inscriptions/{id}',     [InscriptionController::class, 'update']);
Route::delete('/inscriptions/{id}',  [InscriptionController::class, 'destroy']);

// ── COURS
Route::get('/cours/all',     [CoursController::class, 'all']);
Route::get('/cours',         [CoursController::class, 'index']);
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
Route::get('/seances/creneaux',       [SeanceConduiteController::class, 'creneaux']);
Route::get('/seances',                [SeanceConduiteController::class, 'index']);
Route::get('/seances/{id}',           [SeanceConduiteController::class, 'show']);
Route::post('/seances',               [SeanceConduiteController::class, 'store']);
Route::put('/seances/{id}',           [SeanceConduiteController::class, 'update']);
Route::delete('/seances/{id}',        [SeanceConduiteController::class, 'destroy']);
Route::patch('/seances/{id}/annuler', [SeanceConduiteController::class, 'annuler']);

// ── AVIS
Route::get('/avis/approved',      [AvisController::class, 'approved']);
Route::get('/avis',               [AvisController::class, 'index']);
Route::post('/avis',              [AvisController::class, 'store']);
Route::patch('/avis/{id}/statut', [AvisController::class, 'updateStatut']);
Route::delete('/avis/{id}',       [AvisController::class, 'destroy']);

// ── PROGRESSION
Route::get('/progression/admin-stats', [ProgressionController::class, 'adminStats']);
Route::get('/progression',             [ProgressionController::class, 'index']);
Route::get('/progression/by-category', [ProgressionController::class, 'byCategory']);
Route::post('/progression/toggle',     [ProgressionController::class, 'toggle']);

// ── QCM
Route::get('/qcm/questions',  [QcmController::class, 'random']);
Route::get('/qcm',            [QcmController::class, 'index']);
Route::post('/qcm',           [QcmController::class, 'store']);
Route::put('/qcm/{id}',       [QcmController::class, 'update']);
Route::delete('/qcm/{id}',    [QcmController::class, 'destroy']);

// ── FAQ
Route::get('/faq/all',     [FaqController::class, 'all']);
Route::get('/faq',         [FaqController::class, 'index']);
Route::post('/faq',        [FaqController::class, 'store']);
Route::post('/faq/{id}',   [FaqController::class, 'update']);
Route::delete('/faq/{id}', [FaqController::class, 'destroy']);

// ── CONTACT MESSAGES
Route::post('/contact',                         [ContactMessageController::class, 'store']);
Route::get('/contact-messages',                 [ContactMessageController::class, 'index']);
Route::patch('/contact-messages/{id}/lire',     [ContactMessageController::class, 'marquerLu']);
Route::post('/contact-messages/{id}/repondre',  [ContactMessageController::class, 'repondre']);
Route::patch('/contact-messages/{id}/archiver', [ContactMessageController::class, 'archiver']);
Route::delete('/contact-messages/{id}',         [ContactMessageController::class, 'destroy']);

// ── NOTIFICATIONS
Route::get('/notifications',                    [NotificationController::class, 'index']);
Route::post('/notifications',                   [NotificationController::class, 'store']);
Route::patch('/notifications/{id}/lire',        [NotificationController::class, 'marquerLu']);
Route::patch('/notifications/lire-tout',        [NotificationController::class, 'marquerToutLu']);
Route::delete('/notifications/{id}',            [NotificationController::class, 'destroy']);

// ── EXAMEN BLANC
Route::get('/exam/questions',  [ExamController::class, 'questions']);
Route::post('/exam/results',   [ExamController::class, 'store']);
Route::get('/exam/results',    [ExamController::class, 'history']);
Route::get('/exam/stats',      [ExamController::class, 'stats']);