import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderItem {
    product_name: string;
    quantity: number;
    subtotal: number;
}

interface OrderPageProps {
    order: {
        id: number;
        status: string;
        total: number;
        payment_method: string;
        invoice_url: string | null;
        items: OrderItem[];
    };
    pix: { encodedImage: string; payload: string; expirationDate: string } | null;
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

export default function OrderShow({ order, pix }: OrderPageProps) {
    return (
        <>
            <Head title={`Pedido #${order.id}`} />
            <div className="mx-auto max-w-2xl px-4 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Pedido #{order.id}</h1>
                    <Badge variant={order.status === 'paid' ? 'secondary' : 'outline'}>
                        {statusLabels[order.status] ?? order.status}
                    </Badge>
                </div>

                {order.status === 'pending' && order.payment_method === 'PIX' && pix && (
                    <div className="mb-8 flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
                        <p className="text-sm text-muted-foreground">Escaneie o QR Code ou copie o código Pix:</p>
                        <img
                            src={`data:image/png;base64,${pix.encodedImage}`}
                            alt="QR Code Pix"
                            className="size-48"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(pix.payload)}
                        >
                            Copiar código Pix
                        </Button>
                    </div>
                )}

                {order.status === 'pending' && order.payment_method === 'BOLETO' && order.invoice_url && (
                    <div className="mb-8 flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
                        <p className="text-sm text-muted-foreground">Seu boleto está pronto.</p>
                        <Button asChild size="sm">
                            <a href={order.invoice_url} target="_blank" rel="noreferrer">
                                Ver boleto
                            </a>
                        </Button>
                    </div>
                )}

                <div className="flex flex-col gap-2 rounded-xl border p-4">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                {item.quantity}x {item.product_name}
                            </span>
                            <span>{currencyFormatter.format(item.subtotal)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between border-t pt-3 font-semibold">
                        <span>Total</span>
                        <span>{currencyFormatter.format(order.total)}</span>
                    </div>
                </div>
            </div>
        </>
    );
}