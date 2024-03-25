<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RaceController;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth',
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);

    Route::group([
        'middleware' => ['auth:api'],
    ], function ($router) {
        Route::post('logout', [AuthController::class, 'logout']);
        // TODO: Implement token refresh.
        // Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

Route::group([
    'middleware' => ['auth:api'],
], function ($router) {
    Route::get('/races', [RaceController::class, 'index']);
    Route::post('/races', [RaceController::class, 'store']);
    Route::get('/races/{race}', [RaceController::class, 'show']);
    Route::put('/races/{race}', [RaceController::class, 'update']);
    Route::delete('/races/{race}', [RaceController::class, 'destroy']);

    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications/{application}', [ApplicationController::class, 'show']);
    Route::delete('/applications/{application}', [ApplicationController::class, 'destroy']);
});
