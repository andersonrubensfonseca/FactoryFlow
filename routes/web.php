<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('produtos', [ProductController::class, 'index'])->name('products.index');
Route::get('produtos/{product:slug}', [ProductController::class, 'show'])->name('products.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/admin.php';
require __DIR__.'/cart.php';
require __DIR__.'/checkout.php';
require __DIR__.'/reviews.php';
require __DIR__.'/settings.php';
require __DIR__.'/webhooks.php';
