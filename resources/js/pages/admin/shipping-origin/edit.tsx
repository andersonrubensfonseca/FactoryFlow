import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/admin/shipping-origin';

interface ShippingOrigin {
    name: string;
    email: string;
    phone: string;
    document: string | null;
    company_document: string | null;
    state_register: string | null;
    address: string;
    number: string;
    complement: string | null;
    district: string;
    city: string;
    state_abbr: string;
    postal_code: string;
}

interface ShippingOriginEditProps {
    origin: ShippingOrigin | null;
}

export default function ShippingOriginEdit({ origin }: ShippingOriginEditProps) {
    return (
        <>
            <Head title="Endereço de origem" />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-xl font-semibold">Endereço de origem (remetente)</h1>
                <p className="text-sm text-muted-foreground">
                    Usado pelo Melhor Envio como remetente de todas as etiquetas geradas.
                </p>

                <Form {...update.form()} disableWhileProcessing className="flex max-w-2xl flex-col gap-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nome / Razão social</Label>
                                    <Input id="name" name="name" defaultValue={origin?.name ?? ''} required />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input id="email" name="email" type="email" defaultValue={origin?.email ?? ''} required />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Telefone</Label>
                                    <Input id="phone" name="phone" defaultValue={origin?.phone ?? ''} required />
                                    <InputError message={errors.phone} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="document">CPF (pessoa física)</Label>
                                    <Input id="document" name="document" defaultValue={origin?.document ?? ''} />
                                    <InputError message={errors.document} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="company_document">CNPJ (empresa)</Label>
                                    <Input id="company_document" name="company_document" defaultValue={origin?.company_document ?? ''} />
                                    <InputError message={errors.company_document} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="state_register">Inscrição estadual (se CNPJ)</Label>
                                <Input id="state_register" name="state_register" defaultValue={origin?.state_register ?? ''} />
                                <InputError message={errors.state_register} />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 grid gap-2">
                                    <Label htmlFor="address">Endereço</Label>
                                    <Input id="address" name="address" defaultValue={origin?.address ?? ''} required />
                                    <InputError message={errors.address} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="number">Número</Label>
                                    <Input id="number" name="number" defaultValue={origin?.number ?? ''} required />
                                    <InputError message={errors.number} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="complement">Complemento</Label>
                                <Input id="complement" name="complement" defaultValue={origin?.complement ?? ''} />
                                <InputError message={errors.complement} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="district">Bairro</Label>
                                    <Input id="district" name="district" defaultValue={origin?.district ?? ''} required />
                                    <InputError message={errors.district} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="postal_code">CEP</Label>
                                    <Input id="postal_code" name="postal_code" defaultValue={origin?.postal_code ?? ''} required />
                                    <InputError message={errors.postal_code} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 grid gap-2">
                                    <Label htmlFor="city">Cidade</Label>
                                    <Input id="city" name="city" defaultValue={origin?.city ?? ''} required />
                                    <InputError message={errors.city} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="state_abbr">UF</Label>
                                    <Input id="state_abbr" name="state_abbr" maxLength={2} defaultValue={origin?.state_abbr ?? ''} required />
                                    <InputError message={errors.state_abbr} />
                                </div>
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