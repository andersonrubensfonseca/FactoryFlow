import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { index, update } from '@/routes/admin/products';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number;
    min_stock: number;
    image_url: string | null;
}

interface ProductsEditProps {
    product: Product;
    categories: Category[];
}

const fieldClassName =
    'border-input flex w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm';

export default function ProductsEdit({ product, categories }: ProductsEditProps) {
    return (
        <>
            <Head title={`Editar ${product.name}`} />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-xl font-semibold">Editar produto</h1>

                <Form {...update.form(product)} disableWhileProcessing className="flex max-w-xl flex-col gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Categoria</Label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    required
                                    defaultValue={product.category_id}
                                    className={fieldClassName}
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" name="name" defaultValue={product.name} required autoFocus />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" name="slug" defaultValue={product.slug} required />
                                <InputError message={errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Descrição</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={10}
                                    defaultValue={product.description ?? ''}
                                    className={fieldClassName}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Preço</Label>
                                    <Input id="price" name="price" type="number" step="0.01" min="0" defaultValue={product.price} required />
                                    <InputError message={errors.price} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="stock">Estoque</Label>
                                    <Input id="stock" name="stock" type="number" min="0" defaultValue={product.stock} required />
                                    <InputError message={errors.stock} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="min_stock">Estoque mínimo</Label>
                                    <Input id="min_stock" name="min_stock" type="number" min="0" defaultValue={product.min_stock} required />
                                    <InputError message={errors.min_stock} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="image">Imagem</Label>
                                    {product.image_url && (
                                        <img src={product.image_url} alt={product.name} className="h-32 w-32 rounded-md border object-cover" />
                                    )}
                                    <input id="image" name="image" type="file" accept="image/*" className={fieldClassName} />
                                    <InputError message={errors.image} />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit">
                                    {processing && <Spinner />}
                                    Salvar
                                </Button>
                                <Button asChild variant="ghost">
                                    <Link href={index()}>Cancelar</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}