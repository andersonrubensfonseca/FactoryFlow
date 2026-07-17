<?php

namespace App\Console\Commands\MelhorEnvio;

use App\Models\ShippingCredential;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class RefreshToken extends Command
{
    protected $signature = 'melhor-envio:refresh-token';

    protected $description = 'Renova o token de acesso do Melhor Envio antes de expirar';

    public function handle(): int
    {
        $credential = ShippingCredential::current();

        if (! $credential) {
            $this->info('Nenhuma credencial do Melhor Envio conectada.');

            return self::SUCCESS;
        }

        if ($credential->expires_at->subDays(5)->isFuture()) {
            $this->info('Token ainda válido, nada a fazer.');

            return self::SUCCESS;
        }

        $response = Http::asForm()->post(config('services.melhor_envio.base_url').'/oauth/token', [
            'grant_type' => 'refresh_token',
            'client_id' => config('services.melhor_envio.client_id'),
            'client_secret' => config('services.melhor_envio.client_secret'),
            'refresh_token' => $credential->refresh_token,
        ])->throw()->json();

        $credential->update([
            'access_token' => $response['access_token'],
            'refresh_token' => $response['refresh_token'],
            'expires_at' => now()->addSeconds($response['expires_in']),
        ]);

        $this->info('Token renovado com sucesso.');

        return self::SUCCESS;
    }
}
