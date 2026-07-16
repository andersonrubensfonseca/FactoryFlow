<x-mail::message>
# Pagamento confirmado!

Olá {{ $order->user->name }}, seu pagamento do pedido **#{{ $order->id }}** foi confirmado.

**Total pago: R$ {{ number_format($order->total, 2, ',', '.') }}**

<x-mail::button :url="route('orders.show', $order)">
Ver pedido
</x-mail::button>

Obrigado por comprar com a gente!<br>
{{ config('app.name') }}
</x-mail::message>