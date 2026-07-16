import { useState, type SubmitEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Newsletter() {
    const [email, setEmail] = useState('');

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        // TODO: substituir por um POST via Inertia (router.post) assim que
        // existir uma rota de inscrição na newsletter no backend.
    }

    return (
        <section className="mx-auto max-w-6xl px-4 py-16">
            <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-md flex-col items-center gap-3 text-center"
            >
                <h2 className="text-xl font-semibold tracking-tight">Fique por dentro das novidades</h2>
                <p className="text-sm text-muted-foreground">
                    Receba promoções e lançamentos direto no seu e-mail.
                </p>
                <div className="flex w-full gap-2">
                    <Input
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <Button type="submit">Assinar</Button>
                </div>
            </form>
        </section>
    );
}