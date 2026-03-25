<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API fonctionne correctement'
    ]);
});
Route::get('/test-email', [TestController::class, 'testEmail']);