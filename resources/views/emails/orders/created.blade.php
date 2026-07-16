<x-mail::message>
# Pedido recebido!

Olá {{ $order->user->name }}, recebemos seu pedido **#{{ $order->id }}**.

<x-mail::table>
| Produto | Qtd | Subtotal |
| :--- | :---: | ---: |
@foreach ($order->items as $item)
| {{ $item->product_name }} | {{ $item->quantity }} | R$ {{ number_format($item->subtotal, 2, ',', '.') }} |
@endforeach
</x-mail::table>

**Total: R$ {{ number_format($order->total, 2, ',', '.') }}**

<x-mail::button :url="route('orders.show', $order)">
Acompanhar pedido
</x-mail::button>

Obrigado por comprar com a gente!<br>
{{ config('app.name') }}
</x-mail::message>