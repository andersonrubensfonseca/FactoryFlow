<?php

namespace App\Http\Controllers;

use App\Mail\OrderShippingUpdated;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\Response;

class MelhorEnvioWebhookController extends Controller
{
    public function store(Request $request): Response
    {
        if ($request->input('event') === 'webhook.ping') {
            return response()->noContent();
        }

        $signature = base64_encode(
            hash_hmac('sha256', $request->getContent(), (string) config('services.melhor_envio.client_secret'), true)
        );

        abort_unless(
            hash_equals($signature, (string) $request->header('X-ME-Signature')),
            401
        );

        $shipmentId = $request->input('data.id');
        $status = $request->input('data.status');

        $order = Order::where('melhor_envio_shipment_id', $shipmentId)->first();

        if (! $order || ! $status) {
            return response()->noContent();
        }

        $newStatus = match ($status) {
            'posted' => 'posted',
            'delivered' => 'delivered',
            'canceled' => 'cancelled',
            'expired' => 'expired',
            default => $order->shipping_status,
        };

        $trackingUrl = $request->input('data.tracking_url');

        $previousStatus = $order->shipping_status;

        $order->update([
            'shipping_status' => $newStatus,
            'tracking_url' => $trackingUrl ?: $order->tracking_url,
        ]);

        if ($newStatus !== $previousStatus && in_array($newStatus, ['posted', 'delivered', 'cancelled', 'expired'], true)) {
            Mail::to($order->user)->send(new OrderShippingUpdated($order));
        }

        return response()->noContent();
    }
}