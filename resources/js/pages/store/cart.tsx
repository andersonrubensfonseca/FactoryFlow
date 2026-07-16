import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { destroy, update } from '@/routes/cart';
import { index as productsIndex } from '@/routes/products';
import { create } from '@/routes/checkout';

interface CartItem {
    product: {
        id: number;
        name: string;
        price: number;
        stock: number;
        image_url: string | null;
        href: string;
    };
    quantity: number;
    subtotal: number;
}

interface CartPageProps {
    items: CartItem[];
    total: number;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

export default function Cart({ items, total }: CartPageProps) {
    return (
        <>
            <Head title="Carrinho" />
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Carrinho</h1>
                    <Link href={productsIndex()} className="text-sm text-muted-foreground hover:text-foreground">
                        Continuar comprando
                    </Link>
                </div>

                {items.length === 0 ? (
                    <p className="text-muted-foreground">Seu carrinho está vazio.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {items.map((item) => (
                            <div
                                key={item.product.id}
                                className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-16 shrink-0 overflow-hidden rounded-md border">
                                        {item.product.image_url ? (
                                            <img src={item.product.image_url} alt={item.product.name} className="size-full object-cover" />
                                        ) : (
                                            <div className="size-full bg-muted" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Link href={item.product.href} className="font-medium hover:underline">
                                            {item.product.name}
                                        </Link>
                                        <span className="text-sm text-muted-foreground">{currencyFormatter.format(item.product.price)} / un.</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Form {...update.form(item.product)} className="flex items-center gap-2">
                                        {({ processing }) => (
                                            <>
                                                <Input
                                                    type="number"
                                                    name="quantity"
                                                    defaultValue={item.quantity}
                                                    min={1}
                                                    max={item.product.stock}
                                                    className="w-16"
                                                />
                                                <Button type="submit" size="sm" variant="ghost" disabled={processing}>
                                                    Atualizar
                                                </Button>
                                            </>
                                        )}
                                    </Form>

                                    <span className="w-24 text-right font-medium">{currencyFormatter.format(item.subtotal)}</span>

                                    <Link
                                        href={destroy(item.product)}
                                        as="button"
                                        onBefore={() => confirm(`Remover "${item.product.name}" do carrinho?`)}
                                        className="text-sm text-destructive hover:underline"
                                    >
                                        Remover
                                    </Link>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end gap-4 pt-4 text-lg font-semibold">
                            <span>Total:</span>
                            <span>{currencyFormatter.format(total)}</span>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button asChild size="lg">
                                <Link href={create()}>Finalizar compra</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}