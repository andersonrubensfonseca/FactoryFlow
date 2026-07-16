<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\PendingRequest;

class AsaasClient
{
    private function client(): PendingRequest
    {
        return Http::baseUrl(config('services.asaas.base_url'))
            ->withHeaders([
                'access_token' => config('services.asaas.api_key'),
                'Content-Type' => 'application/json',
            ]);
    }

    /**
     * @param array{name: string, cpfCnpj: string, email: string} $data
     */
    public function createCustomer(array $data): string
    {
        $response = $this->client()
            ->post('/customers', $data)
            ->throw();

        return $response->json('id');
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    public function createPayment(array $data): array
    {
        return $this->client()
            ->post('/payments', $data)
            ->throw()
            ->json();
    }

    /**
     * @return array{encodedImage: string, payload: string, expirationDate: string}
     */
    public function getPixQrCode(string $paymentId): array
    {
        return $this->client()
            ->get("/payments/{$paymentId}/pixQrCode")
            ->throw()
            ->json();
    }
}