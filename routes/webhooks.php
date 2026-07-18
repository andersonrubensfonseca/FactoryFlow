<?php

use App\Http\Controllers\AsaasWebhookController;
use App\Http\Controllers\MelhorEnvioWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('webhooks/asaas', [AsaasWebhookController::class, 'store'])->name('webhooks.asaas');
Route::post('webhooks/melhor-envio', [MelhorEnvioWebhookController::class, 'store'])->name('webhooks.melhor-envio');