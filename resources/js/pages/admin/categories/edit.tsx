import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { index, update } from '@/routes/admin/categories';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface CategoriesEditProps {
    category: Category;
}

export default function CategoriesEdit({ category }: CategoriesEditProps) {
    return (
        <>
            <Head title={`Editar ${category.name}`} />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-xl font-semibold">Editar categoria</h1>

                <Form {...update.form(category)} disableWhileProcessing className="flex max-w-md flex-col gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" name="name" defaultValue={category.name} required autoFocus />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" name="slug" defaultValue={category.slug} required />
                                <InputError message={errors.slug} />
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