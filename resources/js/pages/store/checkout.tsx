import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/checkout';

interface CheckoutItem {
    product: { id: number; name: string };
    quantity: number;
    subtotal: number;
}

interface CheckoutProps {
    items: CheckoutItem[];
    total: number;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const fieldClassName =
    'border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm';

const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export default function Checkout({ items, total }: CheckoutProps) {
    return (
        <>
            <Head title="Finalizar compra" />
            <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 md:grid-cols-3">
                <Form {...store.form()} disableWhileProcessing className="flex flex-col gap-6 md:col-span-2">
                    {({ processing, errors }) => (
                        <>
                            <h1 className="text-xl font-semibold">Endereço de entrega</h1>

                            <div className="grid gap-2">
                                <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                                <Input id="cpf_cnpj" name="cpf_cnpj" required />
                                <InputError message={errors.cpf_cnpj} />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 grid gap-2">
                                    <Label htmlFor="address">Endereço</Label>
                                    <Input id="address" name="address" required />
                                    <InputError message={errors.address} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address_number">Número</Label>
                                    <Input id="address_number" name="address_number" required />
                                    <InputError message={errors.address_number} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="complement">Complemento (opcional)</Label>
                                <Input id="complement" name="complement" />
                                <InputError message={errors.complement} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="neighborhood">Bairro</Label>
                                    <Input id="neighborhood" name="neighborhood" required />
                                    <InputError message={errors.neighborhood} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="zip_code">CEP</Label>
                                    <Input id="zip_code" name="zip_code" required />
                                    <InputError message={errors.zip_code} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 grid gap-2">
                                    <Label htmlFor="city">Cidade</Label>
                                    <Input id="city" name="city" required />
                                    <InputError message={errors.city} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="state">UF</Label>
                                    <select id="state" name="state" required defaultValue="" className={fieldClassName}>
                                        <option value="" disabled>
                                            UF
                                        </option>
                                        {states.map((uf) => (
                                            <option key={uf} value={uf}>
                                                {uf}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.state} />
                                </div>
                            </div>

                            <h2 className="mt-4 text-lg font-semibold">Forma de pagamento</h2>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="radio" name="payment_method" value="PIX" defaultChecked />
                                    Pix
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="radio" name="payment_method" value="BOLETO" />
                                    Boleto
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="radio" name="payment_method" value="CREDIT_CARD" />
                                    Cartão de crédito (você será redirecionado para uma página segura)
                                </label>
                                <InputError message={errors.payment_method} />
                            </div>

                            <Button type="submit" size="lg" className="w-fit">
                                {processing && <Spinner />}
                                Confirmar pedido
                            </Button>
                        </>
                    )}
                </Form>

                <div className="flex flex-col gap-4 rounded-xl border p-4">
                    <h2 className="font-semibold">Resumo</h2>
                    {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                {item.quantity}x {item.product.name}
                            </span>
                            <span>{currencyFormatter.format(item.subtotal)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between border-t pt-3 font-semibold">
                        <span>Total</span>
                        <span>{currencyFormatter.format(total)}</span>
                    </div>
                </div>
            </div>
        </>
    );
}