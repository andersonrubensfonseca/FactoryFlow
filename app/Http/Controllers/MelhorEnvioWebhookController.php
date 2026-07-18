<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MelhorEnvioWebhookController extends Controller
{
    public function store(Request $request): Response
    {
        $signature = hash_hmac('sha256', $request->getContent(), (string) config('services.melhor_envio.client_secret'));

        abort_unless(
            hash_equals($signature, (string) $request->header('X-ME-Signature')),
            401
        );

        $shipmentId = $request->input('data.id');

        $order = Order::where('melhor_envio_shipment_id', $shipmentId)->first();

        if (! $order) {
            return response()->noContent();
        }

        $newStatus = match ($request->input('event')) {
            'order.posted' => 'posted',
            'order.delivered' => 'delivered',
            'order.cancelled' => 'cancelled',
            default => $order->shipping_status,
        };

        $order->update(['shipping_status' => $newStatus]);

        return response()->noContent();
    }
}