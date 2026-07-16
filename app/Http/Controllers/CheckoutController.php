<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\AsaasClient;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function create(CartService $cart): Response|RedirectResponse
    {
        if ($cart->items()->isEmpty()) {
            return to_route('cart.index');
        }

        return Inertia::render('store/checkout', [
            'items' => $cart->items()->map(fn (array $item) => [
                'product' => ['id' => $item['product']->id, 'name' => $item['product']->name],
                'quantity' => $item['quantity'],
                'subtotal' => $item['subtotal'],
            ])->values(),
            'total' => $cart->total(),
        ]);
    }

    public function store(Request $request, CartService $cart, AsaasClient $asaas): RedirectResponse
    {
        $items = $cart->items();

        if ($items->isEmpty()) {
            return to_route('cart.index');
        }

        $validated = $request->validate([
            'cpf_cnpj' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],
            'address_number' => ['required', 'string', 'max:20'],
            'complement' => ['nullable', 'string', 'max:255'],
            'neighborhood' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'size:2'],
            'zip_code' => ['required', 'string', 'max:9'],
            'payment_method' => ['required', 'in:PIX,BOLETO,CREDIT_CARD'],
        ]);

        $user = $request->user();

        $order = DB::transaction(function () use ($validated, $items, $user) {
            $order = Order::create([
                ...$validated,
                'user_id' => $user->id,
                'status' => 'pending',
                'total' => $items->sum('subtotal'),
            ]);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'product_name' => $item['product']->name,
                    'unit_price' => $item['product']->price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['subtotal'],
                ]);
            }

            return $order;
        });

        if (! $user->asaas_customer_id) {
            $user->asaas_customer_id = $asaas->createCustomer([
                'name' => $user->name,
                'email' => $user->email,
                'cpfCnpj' => $validated['cpf_cnpj'],
            ]);
            $user->save();
        }

        $payment = $asaas->createPayment([
            'customer' => $user->asaas_customer_id,
            'billingType' => $validated['payment_method'],
            'value' => (float) $order->total,
            'dueDate' => now()->addDay()->format('Y-m-d'),
            'description' => "Pedido #{$order->id}",
            'externalReference' => (string) $order->id,
        ]);

        $order->update([
            'asaas_payment_id' => $payment['id'],
            'invoice_url' => $payment['invoiceUrl'] ?? null,
            'bank_slip_url' => $payment['bankSlipUrl'] ?? null,
        ]);

        $cart->clear();

        return to_route('orders.show', $order);
    }
}