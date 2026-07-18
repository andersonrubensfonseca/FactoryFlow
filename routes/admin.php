<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ThemeController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\MelhorEnvioController; 
use App\Http\Controllers\Admin\ShippingOriginController; 
use App\Http\Controllers\Admin\ShipmentController; 
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('categories', CategoryController::class)->except('show');
    Route::resource('products', ProductController::class)->except('show');
    Route::get('theme', [ThemeController::class, 'edit'])->name('theme.edit');
    Route::put('theme', [ThemeController::class, 'update'])->name('theme.update');
    Route::get('pedidos', [OrderController::class, 'index'])->name('orders.index');
    Route::patch('pedidos/{order}/pronto-para-envio', [OrderController::class, 'markReadyToShip'])->name('orders.ready-to-ship');
    Route::post('pedidos/{order}/calcular-frete', [ShipmentController::class, 'calculate'])->name('shipments.calculate');
    Route::post('pedidos/{order}/gerar-etiqueta', [ShipmentController::class, 'store'])->name('shipments.store');
    Route::get('pedidos/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('melhor-envio', [MelhorEnvioController::class, 'status'])->name('melhor-envio.status');
    Route::get('melhor-envio/connect', [MelhorEnvioController::class, 'connect'])->name('melhor-envio.connect');
    Route::get('melhor-envio/callback', [MelhorEnvioController::class, 'callback'])->name('melhor-envio.callback');
    Route::get('shipping-origin', [ShippingOriginController::class, 'edit'])->name('shipping-origin.edit');
    Route::put('shipping-origin', [ShippingOriginController::class, 'update'])->name('shipping-origin.update');
});