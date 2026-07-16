<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/orders/index', [
            'orders' => Order::query()
                ->with('user')
                ->latest()
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Order $order) => [
                    'id' => $order->id,
                    'customer_name' => $order->user->name,
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'shipping_status' => $order->shipping_status,
                    'created_at' => $order->created_at->format('d/m/Y'),
                ]),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user', 'items']);

        return Inertia::render('admin/orders/show', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'shipping_status' => $order->shipping_status,
                'payment_method' => $order->payment_method,
                'total' => (float) $order->total,
                'customer' => [
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                ],
                'address' => [
                    'address' => $order->address,
                    'address_number' => $order->address_number,
                    'complement' => $order->complement,
                    'neighborhood' => $order->neighborhood,
                    'city' => $order->city,
                    'state' => $order->state,
                    'zip_code' => $order->zip_code,
                ],
                'items' => $order->items->map(fn ($item) => [
                    'product_name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) $item->subtotal,
                ]),
                'created_at' => $order->created_at->format('d/m/Y H:i'),
            ],
        ]);
    }

    public function markReadyToShip(Order $order): RedirectResponse
    {
        abort_unless($order->status === 'paid', 422, 'Só é possível marcar como pronto pedidos pagos.');

        $order->update(['shipping_status' => 'ready_to_ship']);

        return back();
    }
}