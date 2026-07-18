import { Form, Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { index, readyToShip } from '@/routes/admin/orders';
import { calculate, store as storeShipment } from '@/routes/admin/shipments';

interface Quote {
    id: number;
    name: string;
    price: string;
    delivery_time: number;
    company: { name: string };
}

interface OrderItem {
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

interface OrderShowProps {
    order: {
        id: number;
        status: string;
        shipping_status: string | null;
        payment_method: string;
        total: number;
        melhor_envio_shipment_id: string | null;
        shipment_label_url: string | null;
        customer: { name: string; email: string };
        address: {
            address: string;
            address_number: string;
            complement: string | null;
            neighborhood: string;
            city: string;
            state: string;
            zip_code: string;
        };
        items: OrderItem[];
        created_at: string;
    };
    quotes?: Quote[] | null;
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

export default function AdminOrderShow({ order, quotes }: OrderShowProps) {
    return (
        <>
            <Head title={`Pedido #${order.id}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={index()} className="text-sm text-muted-foreground hover:text-foreground">
                            ← Pedidos
                        </Link>
                        <h1 className="text-xl font-semibold">Pedido #{order.id}</h1>
                    </div>
                    <Badge variant={order.status === 'paid' ? 'secondary' : 'outline'}>
                        {statusLabels[order.status] ?? order.status}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2 rounded-xl border p-4">
                        <h2 className="font-medium">Cliente</h2>
                        <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                    </div>

                    <div className="flex flex-col gap-2 rounded-xl border p-4">
                        <h2 className="font-medium">Endereço de entrega</h2>
                        <p className="text-sm text-muted-foreground">
                            {order.address.address}, {order.address.address_number}
                            {order.address.complement ? ` - ${order.address.complement}` : ''}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {order.address.neighborhood} - {order.address.city}/{order.address.state}
                        </p>
                        <p className="text-sm text-muted-foreground">CEP {order.address.zip_code}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 rounded-xl border p-4">
                    <h2 className="mb-2 font-medium">Itens</h2>
                    {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                {item.quantity}x {item.product_name}
                            </span>
                            <span>{currencyFormatter.format(item.subtotal)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Total</span>
                        <span>{currencyFormatter.format(order.total)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                        <h2 className="font-medium">Envio</h2>
                        <p className="text-sm text-muted-foreground">
                            {order.shipping_status === 'ready_to_ship' ? 'Pronto para envio' : 'Ainda não iniciado'}
                        </p>
                    </div>
                    {order.status === 'paid' && !order.shipping_status && (
                        <Button asChild>
                            <Link href={readyToShip(order.id)} method="patch">
                                Marcar como pronto para envio
                            </Link>
                        </Button>
                    )}
                </div>

                {order.shipping_status === 'ready_to_ship' && !order.shipment_label_url && (
                    <div className="flex flex-col gap-4 rounded-xl border p-4">
                        <h2 className="font-medium">Frete</h2>

                        {!quotes && (
                            <Button asChild className="w-fit">
                                <Link href={calculate(order.id)} method="post">
                                    Calcular frete
                                </Link>
                            </Button>
                        )}

                        {quotes && (
                            <Form {...storeShipment.form(order.id)} className="flex flex-col gap-4">
                                {({ processing }) => (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            {quotes.map((quote) => (
                                                <label
                                                    key={quote.id}
                                                    className="flex items-center gap-3 rounded-md border p-3 text-sm"
                                                >
                                                    <input type="radio" name="service_id" value={quote.id} required />
                                                    <span className="flex-1">
                                                        {quote.company.name} - {quote.name}
                                                    </span>
                                                    <span className="text-muted-foreground">{quote.delivery_time} dias</span>
                                                    <span className="font-medium">R$ {quote.price}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <Button type="submit" className="w-fit" disabled={processing}>
                                            {processing && <Spinner />}
                                            Gerar etiqueta e agendar coleta
                                        </Button>
                                    </>
                                )}
                            </Form>
                        )}
                    </div>
                )}

                {order.shipment_label_url && (
                    <div className="flex flex-col gap-3 rounded-xl border p-4">
                        <h2 className="font-medium">Etiqueta gerada</h2>
                        <Button asChild size="sm" variant="outline" className="w-fit">
                            <a href={order.shipment_label_url} target="_blank" rel="noreferrer">
                                Ver/baixar etiqueta
                            </a>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}