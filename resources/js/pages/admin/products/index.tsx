import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { create, destroy, edit } from '@/routes/admin/products';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    min_stock: number;
    image_url: string | null;
    category: { id: number; name: string };
}

interface PaginatedProducts {
    data: Product[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface ProductsIndexProps {
    products: PaginatedProducts;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

export default function AdminProductsIndex({ products }: ProductsIndexProps) {
    return (
        <>
            <Head title="Produtos" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Produtos</h1>
                    <Button asChild size="sm">
                        <Link href={create()}>Novo produto</Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left text-muted-foreground">
                            <tr>
                                <th className="px-4 py-2 font-medium"></th>
                                <th className="px-4 py-2 font-medium">Nome</th>
                                <th className="px-4 py-2 font-medium">Categoria</th>
                                <th className="px-4 py-2 font-medium">Preço</th>
                                <th className="px-4 py-2 font-medium">Estoque</th>
                                <th className="px-4 py-2 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map((product) => (
                                <tr key={product.id} className="border-t">
                                    <td className="px-4 py-2">
                                        <div className="size-10 overflow-hidden rounded-md border">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="size-full object-cover" />
                                            ) : (
                                                <div className="size-full bg-muted" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">{product.name}</td>
                                    <td className="px-4 py-2 text-muted-foreground">{product.category.name}</td>
                                    <td className="px-4 py-2">{currencyFormatter.format(product.price)}</td>
                                    <td className="px-4 py-2">
                                        <span className={product.stock <= product.min_stock ? 'font-medium text-destructive' : undefined}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link href={edit(product)} className="text-muted-foreground hover:text-foreground">
                                                Editar
                                            </Link>
                                            <Link
                                                href={destroy(product)}
                                                as="button"
                                                onBefore={() => confirm(`Excluir o produto "${product.name}"?`)}
                                                className="text-destructive hover:underline"
                                            >
                                                Excluir
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                                        Nenhum produto cadastrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center gap-4 text-sm">
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
            </div>
        </>
    );
}