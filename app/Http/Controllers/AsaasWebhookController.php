<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AsaasWebhookController extends Controller
{
    public function store(Request $request): Response
    {
        abort_unless(
            hash_equals((string) config('services.asaas.webhook_token'), (string) $request->header('asaas-access-token')),
            401
        );

        $event = $request->string('event')->toString();
        $paymentId = $request->input('payment.id');

        $order = Order::where('asaas_payment_id', $paymentId)->first();

        if (! $order) {
            return response()->noContent();
        }

        $newStatus = match ($event) {
            'PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED' => 'paid',
            'PAYMENT_OVERDUE' => 'expired',
            'PAYMENT_DELETED', 'PAYMENT_REFUNDED' => 'canceled',
            default => $order->status,
        };

        if ($newStatus === 'paid' && $order->status !== 'paid') {
            foreach ($order->items as $item) {
                $item->product?->decrement('stock', $item->quantity);
            }
        }

        $order->update(['status' => $newStatus]);

        return response()->noContent();
    }
}