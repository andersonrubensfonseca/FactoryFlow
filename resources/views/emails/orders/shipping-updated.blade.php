<x-mail::message>
@if ($order->shipping_status === 'posted')
# Seu pedido foi postado!

Seu pedido **#{{ $order->id }}** já está a caminho.
@elseif ($order->shipping_status === 'delivered')
# Seu pedido foi entregue!

Seu pedido **#{{ $order->id }}** foi entregue com sucesso. Esperamos que você aproveite!
@elseif ($order->shipping_status === 'cancelled')
# Envio cancelado

O envio do seu pedido **#{{ $order->id }}** foi cancelado.
@elseif ($order->shipping_status === 'expired')
# Envio expirado

O envio do seu pedido **#{{ $order->id }}** expirou.
@endif

@if ($order->tracking_url)
<x-mail::button :url="$order->tracking_url">
Rastrear pedido
</x-mail::button>
@endif

<x-mail::button :url="route('orders.show', $order)">
Ver pedido
</x-mail::button>

Obrigado por comprar com a gente!<br>
{{ config('app.name') }}
</x-mail::message>