import { Form, Link } from '@inertiajs/react';
import StarRatingBasic from '@/components/commerce-ui/star-rating-basic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { store as cartStore } from '@/routes/cart';

export interface Product {
    id: number;
    name: string;
    price: number;
    rating: number;
    stock: number;
    image_url: string | null;
    href: string;
}

interface ProductCardProps {
    product: Product;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

export default function ProductCard({ product }: ProductCardProps) {
    const inStock = product.stock > 0;

    return (
        <Card className="overflow-hidden py-0">
            <Link href={product.href}>
                <div className="relative aspect-square">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="size-full object-cover" />
                    ) : (
                        <PlaceholderPattern className="size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                    )}
                </div>
            </Link>
            <CardContent className="flex flex-col gap-2 px-4 pb-2">
                <Link href={product.href} className="line-clamp-1 text-sm font-medium hover:underline">
                    {product.name}
                </Link>
                <StarRatingBasic value={product.rating} iconSize={14} readOnly />
                <span className="text-base font-semibold">{currencyFormatter.format(product.price)}</span>
            </CardContent>
            <CardFooter className="px-4 pb-4">
                <Form {...cartStore.form()} className="w-full">
                    {({ processing }) => (
                        <>
                            <input type="hidden" name="product_id" value={product.id} />
                            <Button type="submit" size="sm" className="w-full" disabled={!inStock || processing}>
                                {inStock ? 'Adicionar' : 'Esgotado'}
                            </Button>
                        </>
                    )}
                </Form>
            </CardFooter>
        </Card>
    );
}