<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ThemeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('categories', CategoryController::class)->except('show');
    Route::resource('products', ProductController::class)->except('show');
    Route::get('theme', [ThemeController::class, 'edit'])->name('theme.edit');
    Route::put('theme', [ThemeController::class, 'update'])->name('theme.update');
    Route::get('pedidos', [OrderController::class, 'index'])->name('orders.index');
    Route::get('pedidos/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('pedidos/{order}/pronto-para-envio', [OrderController::class, 'markReadyToShip'])->name('orders.ready-to-ship');
});