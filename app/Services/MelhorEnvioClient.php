<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ShippingCredential;
use App\Models\ShippingOrigin;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class MelhorEnvioClient
{
    private function client(): PendingRequest
    {
        $credential = ShippingCredential::current();

        return Http::baseUrl(config('services.melhor_envio.base_url').'/api/v2')
            ->withToken($credential?->access_token)
            ->withHeaders([
                'Accept' => 'application/json',
                'User-Agent' => config('app.name').' ('.config('mail.from.address').')',
            ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function calculate(Order $order): array
    {
        $origin = ShippingOrigin::current();
        $volume = $this->orderVolume($order);

        return $this->client()
            ->post('/me/shipment/calculate', [
                'from' => ['postal_code' => $origin->postal_code],
                'to' => ['postal_code' => $order->zip_code],
                'volumes' => [[
                    'height' => $volume['height'],
                    'width' => $volume['width'],
                    'length' => $volume['length'],
                    // este endpoint espera peso em KG, diferente do /me/cart (que espera gramas) -- confirmado na doc
                    'weight' => $volume['weight'] / 1000,
                    'insurance_value' => (float) $order->total,
                ]],
            ])
            ->throw()
            ->json();
    }

    public function addToCart(Order $order, int $serviceId): string
    {
        $origin = ShippingOrigin::current();
        $volume = $this->orderVolume($order);

        $response = $this->client()
            ->post('/me/cart', [
                'service' => $serviceId,
                'from' => $origin->toMelhorEnvioPayload(),
                'to' => [
                    'name' => $order->user->name,
                    'phone' => $order->phone,
                    'document' => $order->cpf_cnpj,
                    'address' => $order->address,
                    'number' => $order->address_number,
                    'complement' => $order->complement,
                    'district' => $order->neighborhood,
                    'city' => $order->city,
                    'state_abbr' => $order->state,
                    'postal_code' => $order->zip_code,
                    'country_id' => 'BR',
                ],
                'products' => $order->items->map(fn ($item) => [
                    'name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unitary_value' => (float) $item->unit_price,
                ])->all(),
                'volumes' => [[
                    'height' => $volume['height'],
                    'width' => $volume['width'],
                    'length' => $volume['length'],
                    'weight' => $volume['weight'],
                ]],
                'options' => [
                    'insurance_value' => (float) $order->total,
                    'receipt' => false,
                    'own_hand' => false,
                    'platform' => config('app.name'),
                    'tags' => [['tag' => "Pedido #{$order->id}"]],
                ],
            ])
            ->throw()
            ->json();

        return $response['id'];
    }

    public function checkout(string $shipmentId): void
    {
        $this->client()->post('/me/shipment/checkout', [
            'orders' => [$shipmentId],
        ])->throw();
    }

    public function generate(string $shipmentId): void
    {
        $this->client()->post('/me/shipment/generate', [
            'orders' => [$shipmentId],
        ])->throw();
    }

    public function print(string $shipmentId): string
    {
        $response = $this->client()
            ->post('/me/shipment/print', [
                'orders' => [$shipmentId],
                'mode' => 'public',
            ])
            ->throw()
            ->json();

        return $response['url'];
    }

    /**
     * @return array{weight: int, height: int, width: int, length: int}
     */
    private function orderVolume(Order $order): array
    {
        $order->loadMissing('items.product');

        $weight = 0;
        $height = 1;
        $width = 1;
        $length = 1;

        foreach ($order->items as $item) {
            $product = $item->product;

            if (! $product) {
                continue;
            }

            $weight += $product->weight * $item->quantity;
            $height = max($height, $product->height);
            $width = max($width, $product->width);
            $length = max($length, $product->length);
        }

        return [
            'weight' => max($weight, 1),
            'height' => $height,
            'width' => $width,
            'length' => $length,
        ];
    }
}