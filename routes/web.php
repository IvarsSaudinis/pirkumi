<?php

use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\ResultController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('upload');
})->name('home');

Route::post('/upload', [ReceiptController::class, 'store'])->name('upload');
Route::get('/results/{hash}', [ResultController::class, 'show'])->name('results');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
