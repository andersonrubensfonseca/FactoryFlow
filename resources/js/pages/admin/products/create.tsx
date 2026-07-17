import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { index, store } from '@/routes/admin/products';

interface Category {
    id: number;
    name: string;
}

interface ProductsCreateProps {
    categories: Category[];
}

const fieldClassName =
    'border-input flex w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm';

export default function ProductsCreate({ categories }: ProductsCreateProps) {
    return (
        <>
            <Head title="Novo produto" />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-xl font-semibold">Novo produto</h1>

                <Form {...store.form()} disableWhileProcessing className="flex max-w-xl flex-col gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Categoria</Label>
                                <select id="category_id" name="category_id" required defaultValue="" className={fieldClassName}>
                                    <option value="" disabled>
                                        Selecione uma categoria
                                    </option>
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
                                <Input id="name" name="name" required autoFocus />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Descrição</Label>
                                <textarea id="description" name="description" rows={10} className={fieldClassName} />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Preço</Label>
                                    <Input id="price" name="price" type="number" step="0.01" min="0" required />
                                    <InputError message={errors.price} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="stock">Estoque</Label>
                                    <Input id="stock" name="stock" type="number" min="0" required defaultValue={0} />
                                    <InputError message={errors.stock} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="min_stock">Estoque mínimo</Label>
                                    <Input id="min_stock" name="min_stock" type="number" min="0" required defaultValue={0} />
                                    <InputError message={errors.min_stock} />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="weight">Peso (g)</Label>
                                    <Input id="weight" name="weight" type="number" min="1" required defaultValue={1} />
                                    <InputError message={errors.weight} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="height">Altura (cm)</Label>
                                    <Input id="height" name="height" type="number" min="1" required defaultValue={1} />
                                    <InputError message={errors.height} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="width">Largura (cm)</Label>
                                    <Input id="width" name="width" type="number" min="1" required defaultValue={1} />
                                    <InputError message={errors.width} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="length">Comprimento (cm)</Label>
                                    <Input id="length" name="length" type="number" min="1" required defaultValue={1} />
                                    <InputError message={errors.length} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="image">Imagem</Label>
                                <input id="image" name="image" type="file" accept="image/*" className={fieldClassName} />
                                <InputError message={errors.image} />
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