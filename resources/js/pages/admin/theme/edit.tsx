import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/admin/theme';

interface ThemeEditProps {
    theme: {
        primary_color_light: string;
        primary_color_dark: string;
    };
}

export default function ThemeEdit({ theme }: ThemeEditProps) {
    return (
        <>
            <Head title="Paleta de cores" />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-xl font-semibold">Paleta de cores</h1>

                <Form {...update.form()} disableWhileProcessing className="flex max-w-md flex-col gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="primary_color_light">Cor principal (modo claro)</Label>
                                <input
                                    id="primary_color_light"
                                    name="primary_color_light"
                                    type="color"
                                    defaultValue={theme.primary_color_light}
                                    className="h-10 w-20 cursor-pointer rounded-md border"
                                />
                                <InputError message={errors.primary_color_light} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="primary_color_dark">Cor principal (modo escuro)</Label>
                                <input
                                    id="primary_color_dark"
                                    name="primary_color_dark"
                                    type="color"
                                    defaultValue={theme.primary_color_dark}
                                    className="h-10 w-20 cursor-pointer rounded-md border"
                                />
                                <InputError message={errors.primary_color_dark} />
                            </div>

                            <Button type="submit" className="w-fit">
                                {processing && <Spinner />}
                                Salvar
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}