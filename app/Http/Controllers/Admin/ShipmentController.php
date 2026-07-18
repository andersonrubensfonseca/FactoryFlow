<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\MelhorEnvioClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShipmentController extends Controller
{
    public function calculate(Order $order, MelhorEnvioClient $melhorEnvio): Response
    {
        $order->load(['user', 'items']);

        return Inertia::render('admin/orders/show', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'shipping_status' => $order->shipping_status,
                'payment_method' => $order->payment_method,
                'total' => (float) $order->total,
                'melhor_envio_shipment_id' => $order->melhor_envio_shipment_id,
                'shipment_label_url' => $order->shipment_label_url,
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
            'quotes' => $melhorEnvio->calculate($order),
        ]);
    }

    public function store(Request $request, Order $order, MelhorEnvioClient $melhorEnvio): RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'integer'],
        ]);

        $shipmentId = $melhorEnvio->addToCart($order, $validated['service_id']);

        $melhorEnvio->checkout($shipmentId);
        $melhorEnvio->generate($shipmentId);

        $labelUrl = $melhorEnvio->print($shipmentId);

        $order->update([
            'melhor_envio_shipment_id' => $shipmentId,
            'shipment_label_url' => $labelUrl,
            'shipping_status' => 'label_generated',
        ]);

        return back();
    }
}