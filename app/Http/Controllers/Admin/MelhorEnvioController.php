<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingCredential;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MelhorEnvioController extends Controller
{
    private const SCOPES = [
        'cart-read', 'cart-write',
        'shipping-calculate', 'shipping-checkout', 'shipping-generate',
        'shipping-print', 'shipping-tracking', 'shipping-cancel',
    ];

    public function status(): Response
    {
        $credential = ShippingCredential::current();

        return Inertia::render('admin/melhor-envio/status', [
            'connected' => $credential !== null,
            'expiresAt' => $credential?->expires_at->format('d/m/Y H:i'),
        ]);
    }

    public function connect(Request $request): HttpResponse
    {
        $state = Str::random(40);
        $request->session()->put('melhor_envio_state', $state);

        $query = http_build_query([
            'client_id' => config('services.melhor_envio.client_id'),
            'redirect_uri' => config('services.melhor_envio.redirect_uri'),
            'response_type' => 'code',
            'scope' => implode(' ', self::SCOPES),
            'state' => $state,
        ]);

        return Inertia::location(config('services.melhor_envio.base_url')."/oauth/authorize?{$query}");
    }
    public function callback(Request $request): RedirectResponse
    {
        abort_unless(
            $request->query('state') === $request->session()->pull('melhor_envio_state'),
            403,
            'Estado inválido.'
        );

        $response = Http::asForm()->post(config('services.melhor_envio.base_url').'/oauth/token', [
            'grant_type' => 'authorization_code',
            'client_id' => config('services.melhor_envio.client_id'),
            'client_secret' => config('services.melhor_envio.client_secret'),
            'redirect_uri' => config('services.melhor_envio.redirect_uri'),
            'code' => $request->query('code'),
        ])->throw()->json();

        ShippingCredential::query()->delete();

        ShippingCredential::create([
            'access_token' => $response['access_token'],
            'refresh_token' => $response['refresh_token'],
            'expires_at' => now()->addSeconds($response['expires_in']),
        ]);

        return to_route('admin.melhor-envio.status');
    }
}