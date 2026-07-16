import ProductCard, { type Product } from '@/components/store/product-card';

interface ProductGridProps {
    title: string;
    products: Product[];
}

export default function ProductGrid({ title, products }: ProductGridProps) {
    if (products.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">{title}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}