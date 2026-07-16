import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import StarRatingBasic from '@/components/commerce-ui/star-rating-basic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { store as cartStore } from '@/routes/cart';
import { destroy as reviewDestroy, store as reviewStore } from '@/routes/reviews';
import { login } from '@/routes';

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    user_id: number;
    user_name: string;
    created_at: string;
}

interface ProductShowProps {
    product: {
        id: number;
        name: string;
        description: string | null;
        price: number;
        rating: number;
        stock: number;
        image_url: string | null;
        category: {
            name: string;
            href: string;
        };
    };
    reviews: Review[];
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const textareaClassName =
    'border-input flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm';

export default function ProductShow({ product, reviews }: ProductShowProps) {
    const { auth } = usePage().props;
    const inStock = product.stock > 0;

    const myReview = reviews.find((review) => review.user_id === auth.user?.id);
    const [rating, setRating] = useState(myReview?.rating ?? 5);

    return (
        <>
            <Head title={product.name} />
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
                <div className="aspect-square overflow-hidden rounded-xl border">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="size-full object-cover" />
                    ) : (
                        <PlaceholderPattern className="size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <Link href={product.category.href} className="text-sm text-muted-foreground hover:text-foreground">
                        {product.category.name}
                    </Link>

                    <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>

                    <StarRatingBasic value={product.rating} iconSize={18} readOnly />

                    <span className="text-3xl font-semibold">{currencyFormatter.format(product.price)}</span>

                    <Badge variant={inStock ? 'secondary' : 'destructive'} className="w-fit">
                        {inStock ? 'Em estoque' : 'Fora de estoque'}
                    </Badge>

                    {product.description && <p className="text-muted-foreground">{product.description}</p>}

                    <Form {...cartStore.form()}>
                        {({ processing }) => (
                            <>
                                <input type="hidden" name="product_id" value={product.id} />
                                <Button type="submit" size="lg" className="w-fit" disabled={!inStock || processing}>
                                    Adicionar ao carrinho
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 pb-16">
                <div className="flex flex-col gap-6 border-t pt-8">
                    <h2 className="text-lg font-semibold">Avaliações ({reviews.length})</h2>

                    {auth.user ? (
                        <Form {...reviewStore.form(product.id)} className="flex max-w-md flex-col gap-3">
                            {({ processing, errors }) => (
                                <>
                                    <Label>Sua avaliação</Label>
                                    <StarRatingBasic value={rating} onChange={setRating} iconSize={22} />
                                    <input type="hidden" name="rating" value={rating} />
                                    <InputError message={errors.rating} />

                                    <Label htmlFor="comment">Comentário (opcional)</Label>
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        rows={3}
                                        defaultValue={myReview?.comment ?? ''}
                                        className={textareaClassName}
                                    />
                                    <InputError message={errors.comment} />

                                    <Button type="submit" className="w-fit" disabled={processing}>
                                        {myReview ? 'Atualizar avaliação' : 'Enviar avaliação'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            <Link href={login()} className="underline">
                                Faça login
                            </Link>{' '}
                            para avaliar esse produto.
                        </p>
                    )}

                    <div className="flex flex-col gap-4">
                        {reviews.length === 0 && <p className="text-sm text-muted-foreground">Ainda não há avaliações.</p>}
                        {reviews.map((review) => (
                            <div key={review.id} className="flex flex-col gap-1 border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{review.user_name}</span>
                                    <span className="text-xs text-muted-foreground">{review.created_at}</span>
                                </div>
                                <StarRatingBasic value={review.rating} iconSize={14} readOnly />
                                {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                                {auth.user?.id === review.user_id && (
                                    <Link
                                        href={reviewDestroy(review.id)}
                                        as="button"
                                        onBefore={() => confirm('Excluir sua avaliação?')}
                                        className="mt-1 w-fit text-xs text-destructive hover:underline"
                                    >
                                        Excluir
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}