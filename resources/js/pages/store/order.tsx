import { Head, usePoll  } from '@inertiajs/react';
import { useEffect } from 'react';
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
        bank_slip_url: string | null;
        shipping_status: string | null; 
        tracking_url: string | null;
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

const shippingStatusLabels: Record<string, string> = {
    ready_to_ship: 'Separando seu pedido',
    label_generated: 'Aguardando coleta',
    posted: 'A caminho',
    delivered: 'Entregue',
    cancelled: 'Envio cancelado',
    expired: 'Envio expirado',
};

export default function OrderShow({ order, pix }: OrderPageProps) {
    const { stop } = usePoll(5000, { only: ['order', 'pix'] });

    useEffect(() => {
        if (order.status !== 'pending') {
            stop();
        }
    }, [order.status, stop]);

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
                        <p className="text-xs text-muted-foreground">Atualizando automaticamente...</p>
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

                {order.status === 'pending' && order.payment_method === 'BOLETO' && order.bank_slip_url && (
                    <div className="mb-8 flex flex-col items-center gap-3 rounded-xl border p-6">
                        <p className="text-sm text-muted-foreground">Seu boleto está pronto:</p>
                        <iframe
                            src={order.bank_slip_url}
                            title="Boleto"
                            className="h-[600px] w-full rounded-lg border"
                        />
                        <Button asChild size="sm" variant="outline">
                            <a href={order.bank_slip_url} target="_blank" rel="noreferrer" download>
                                Baixar boleto
                            </a>
                        </Button>
                    </div>
                )}

                {order.status === 'pending' && order.payment_method === 'CREDIT_CARD' && order.invoice_url && (
                    <div className="mb-8 flex flex-col items-center gap-3 rounded-xl border p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Finalize o pagamento com cartão numa página segura do ASAAS.
                        </p>
                        <Button asChild size="lg">
                            <a href={order.invoice_url} target="_blank" rel="noreferrer">
                                Pagar com cartão
                            </a>
                        </Button>
                    </div>
                )}

                {order.status === 'paid' && order.shipping_status && (
                    <div className="mb-8 flex items-center justify-between rounded-xl border p-4">
                        <div>
                            <h2 className="font-medium">Envio</h2>
                            <p className="text-sm text-muted-foreground">
                                {shippingStatusLabels[order.shipping_status] ?? order.shipping_status}
                            </p>
                        </div>
                        {order.tracking_url && (
                            <Button asChild size="sm" variant="outline">
                                <a href={order.tracking_url} target="_blank" rel="noreferrer">
                                    Rastrear pedido
                                </a>
                            </Button>
                        )}
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