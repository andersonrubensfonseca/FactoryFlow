<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\AsaasClient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{

    public function index(Request $request): Response
    {
        $orders = $request->user()
            ->orders()
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'status' => $order->status,
                'total' => (float) $order->total,
                'payment_method' => $order->payment_method,
                'shipping_status' => $order->shipping_status,
                'created_at' => $order->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('store/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order, AsaasClient $asaas): Response
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        $pix = null;

        if ($order->payment_method === 'PIX' && $order->status === 'pending' && $order->asaas_payment_id) {
            $pix = $asaas->getPixQrCode($order->asaas_payment_id);
        }

        return Inertia::render('store/order', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'total' => (float) $order->total,
                'payment_method' => $order->payment_method,
                'invoice_url' => $order->invoice_url,
                'bank_slip_url' => $order->bank_slip_url,
                'shipping_status' => $order->shipping_status, 
                'tracking_url' => $order->tracking_url,
                'items' => $order->items->map(fn ($item) => [
                    'product_name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'subtotal' => (float) $item->subtotal,
                ]),
            ],
            'pix' => $pix,
        ]);
    }
}