import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { show } from '@/routes/admin/orders';

interface Order {
    id: number;
    customer_name: string;
    total: number;
    status: string;
    shipping_status: string | null;
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

const shippingStatusLabels: Record<string, string> = {
    ready_to_ship: 'Pronto para envio',
    label_generated: 'Etiqueta gerada',
    posted: 'Postado/coletado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
    expired: 'Expirado',
};

export default function AdminOrdersIndex({ orders }: OrdersIndexProps) {
    return (
        <>
            <Head title="Pedidos" />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-xl font-semibold">Pedidos</h1>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left text-muted-foreground">
                            <tr>
                                <th className="px-4 py-2 font-medium">Pedido</th>
                                <th className="px-4 py-2 font-medium">Cliente</th>
                                <th className="px-4 py-2 font-medium">Total</th>
                                <th className="px-4 py-2 font-medium">Pagamento</th>
                                <th className="px-4 py-2 font-medium">Envio</th>
                                <th className="px-4 py-2 font-medium">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="px-4 py-2">
                                        <Link href={show(order.id)} className="font-medium hover:underline">
                                            #{order.id}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2">{order.customer_name}</td>
                                    <td className="px-4 py-2">{currencyFormatter.format(order.total)}</td>
                                    <td className="px-4 py-2">
                                        <Badge variant={order.status === 'paid' ? 'secondary' : 'outline'}>
                                            {statusLabels[order.status] ?? order.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-2">
                                        {order.shipping_status ? (
                                            <Badge variant="secondary">
                                                {shippingStatusLabels[order.shipping_status] ?? order.shipping_status}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-muted-foreground">{order.created_at}</td>
                                </tr>
                            ))}
                            {orders.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                                        Nenhum pedido ainda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center gap-4 text-sm">
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