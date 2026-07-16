import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { create, destroy, edit } from '@/routes/admin/categories';

interface Category {
    id: number;
    name: string;
    slug: string;
    products_count: number;
}

interface CategoriesIndexProps {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    return (
        <>
            <Head title="Categorias" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Categorias</h1>
                    <Button asChild size="sm">
                        <Link href={create()}>Nova categoria</Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left text-muted-foreground">
                            <tr>
                                <th className="px-4 py-2 font-medium">Nome</th>
                                <th className="px-4 py-2 font-medium">Slug</th>
                                <th className="px-4 py-2 font-medium">Produtos</th>
                                <th className="px-4 py-2 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="border-t">
                                    <td className="px-4 py-2">{category.name}</td>
                                    <td className="px-4 py-2 text-muted-foreground">{category.slug}</td>
                                    <td className="px-4 py-2">{category.products_count}</td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link href={edit(category)} className="text-muted-foreground hover:text-foreground">
                                                Editar
                                            </Link>
                                            <Link
                                                href={destroy(category)}
                                                as="button"
                                                onBefore={() => confirm(`Excluir a categoria "${category.name}"?`)}
                                                className="text-destructive hover:underline"
                                            >
                                                Excluir
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                                        Nenhuma categoria cadastrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}