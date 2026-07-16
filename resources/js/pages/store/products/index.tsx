import { Head, Link } from '@inertiajs/react';
import ProductGrid from '@/components/store/product-grid';
import type { Product } from '@/components/store/product-card';

interface CategoryFilter {
    id: number;
    name: string;
    href: string;
    active: boolean;
}

interface PaginatedProducts {
    data: Product[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface ProductsIndexProps {
    products: PaginatedProducts;
    categories: CategoryFilter[];
    allProductsHref: string;
}

export default function ProductsIndex({ products, categories, allProductsHref }: ProductsIndexProps) {
    const hasActiveFilter = categories.some((category) => category.active);

    return (
        <>
            <Head title="Produtos" />

            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="flex flex-wrap gap-4 text-sm">
                    <Link
                        href={allProductsHref}
                        className={hasActiveFilter ? 'text-muted-foreground hover:text-foreground' : 'font-medium'}
                    >
                        Todas
                    </Link>
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.href}
                            className={category.active ? 'font-medium' : 'text-muted-foreground hover:text-foreground'}
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>
            </div>

            <ProductGrid title="Produtos" products={products.data} />

            <div className="mx-auto flex max-w-6xl justify-center gap-4 px-4 pb-16 text-sm">
                {products.prev_page_url && (
                    <Link href={products.prev_page_url} className="underline">
                        Anterior
                    </Link>
                )}
                {products.next_page_url && (
                    <Link href={products.next_page_url} className="underline">
                        Próxima
                    </Link>
                )}
            </div>
        </>
    );
}