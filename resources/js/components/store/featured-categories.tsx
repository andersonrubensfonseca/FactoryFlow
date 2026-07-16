import { Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';

interface Category {
    title: string;
    href: string;
    imageUrl?: string;
}

interface FeaturedCategoriesProps {
    categories: Category[];
}

export default function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
    if (categories.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">Categorias</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {categories.map((category) => (
                    <Link key={category.title} href={category.href}>
                        <Card className="items-center justify-center py-10 text-center transition-colors hover:bg-accent">
                            <span className="text-sm font-medium">{category.title}</span>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}