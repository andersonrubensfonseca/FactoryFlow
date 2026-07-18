import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { show } from '@/routes/orders';

interface Order {
    id: number;
    status: string;
    total: number;
    payment_method: string;
    shipping_status: string | null
    created_at: string;
}

interface PaginatedOrders {
    data: Order[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface OrdersIndexProps {
    orders: PaginatedOrders;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const statusLabels: Record<string, string> = {
    pending: 'Aguardando pagamento',
    paid: 'Pago',
    failed: 'Falhou',
    canceled: 'Cancelado',
    expired: 'Expirado',
};

const paymentMethodLabels: Record<string, string> = {
    PIX: 'Pix',
    BOLETO: 'Boleto',
    CREDIT_CARD: 'Cartão de crédito',
};

const shippingStatusLabels: Record<string, string> = {
    ready_to_ship: 'Separando seu pedido',
    label_generated: 'Aguardando coleta',
    posted: 'A caminho',
    delivered: 'Entregue',
    cancelled: 'Envio cancelado',
    expired: 'Envio expirado',
};

export default function OrdersIndex({ orders }: OrdersIndexProps) {
    return (
        <>
            <Head title="Meus pedidos" />
            <div className="mx-auto max-w-3xl px-4 py-10">
                <h1 className="mb-6 text-2xl font-semibold tracking-tight">Meus pedidos</h1>

                {orders.data.length === 0 ? (
                    <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {orders.data.map((order) => (
                            <Link
                                key={order.id}
                                href={show(order.id)}
                                className="flex items-center justify-between rounded-xl border p-4 hover:bg-accent"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium">Pedido #{order.id}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {order.created_at} · {paymentMethodLabels[order.payment_method] ?? order.payment_method}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge variant={order.status === 'paid' ? 'secondary' : 'outline'}>
                                        {statusLabels[order.status] ?? order.status}
                                    </Badge>
                                    {order.shipping_status && (
                                        <Badge variant={order.shipping_status === 'delivered' ? 'secondary' : 'outline'}>
                                            {shippingStatusLabels[order.shipping_status] ?? order.shipping_status}
                                        </Badge>
                                    )}
                                    <span className="font-medium">{currencyFormatter.format(order.total)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex justify-center gap-4 text-sm">
                    {orders.prev_page_url && (
                        <Link href={orders.prev_page_url} className="underline">
                            Anterior
                        </Link>
                    )}
                    {orders.next_page_url && (
                        <Link href={orders.next_page_url} className="underline">
                            Próxima
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}