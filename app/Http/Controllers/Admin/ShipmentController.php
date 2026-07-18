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
    public function calculate(Order $order, MelhorEnvioClient $melhorEnvio): RedirectResponse
    {
        $quotes = $melhorEnvio->calculate($order);

        session()->put("shipment_quotes.{$order->id}", $quotes);

        return to_route('admin.orders.show', $order);
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