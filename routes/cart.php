<?php

use App\Http\Controllers\CartController;
use Illuminate\Support\Facades\Route;

Route::prefix('carrinho')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/', [CartController::class, 'store'])->name('store');
    Route::patch('{product}', [CartController::class, 'update'])->name('update');
    Route::delete('{product}', [CartController::class, 'destroy'])->name('destroy');
});