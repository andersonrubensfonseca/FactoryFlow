<?php

use App\Http\Controllers\AsaasWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('webhooks/asaas', [AsaasWebhookController::class, 'store'])->name('webhooks.asaas');