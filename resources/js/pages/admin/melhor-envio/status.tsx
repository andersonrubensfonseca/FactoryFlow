import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { connect } from '@/routes/admin/melhor-envio';

interface StatusProps {
    connected: boolean;
    expiresAt: string | null;
}

export default function MelhorEnvioStatus({ connected, expiresAt }: StatusProps) {
    return (
        <>
            <Head title="Melhor Envio" />
            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-xl font-semibold">Integração com Melhor Envio</h1>

                <div className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                        <Badge variant={connected ? 'secondary' : 'outline'}>
                            {connected ? 'Conectado' : 'Não conectado'}
                        </Badge>
                        {connected && expiresAt && (
                            <p className="mt-2 text-sm text-muted-foreground">Token válido até {expiresAt}</p>
                        )}
                    </div>
                    <Button asChild>
                        <Link href={connect()}>{connected ? 'Reconectar' : 'Conectar conta'}</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}