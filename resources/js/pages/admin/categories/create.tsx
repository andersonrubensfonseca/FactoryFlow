import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { index, store } from '@/routes/admin/categories';

export default function CategoriesCreate() {
    return (
        <>
            <Head title="Nova categoria" />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-xl font-semibold">Nova categoria</h1>

                <Form {...store.form()} disableWhileProcessing className="flex max-w-md flex-col gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" name="name" required autoFocus />
                                <InputError message={errors.name} />
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