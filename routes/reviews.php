<?php

use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('produtos/{product}/avaliacoes', [ReviewController::class, 'store'])->name('reviews.store');
    Route::delete('avaliacoes/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
});