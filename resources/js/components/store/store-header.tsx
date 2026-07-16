import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard, home, login, register } from '@/routes';
import { index as cartIndex } from '@/routes/cart';
import { index as ordersIndex } from '@/routes/orders';

export default function StoreHeader() {
    const { auth, cart } = usePage().props;

    return (
        <header className="border-b border-sidebar-border/70 dark:border-sidebar-border">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
                <Link href={home()} className="text-lg font-semibold">
                    FactoryFlow
                </Link>

                <nav className="hidden items-center gap-6 text-sm md:flex">
                    {/* categorias entram aqui quando existirem */}
                </nav>

                <div className="flex items-center gap-3">
                    <Link href={cartIndex()} className="relative text-muted-foreground hover:text-foreground">
                        <ShoppingCart className="size-5" />
                        {cart.count > 0 && (
                            <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                {cart.count}
                            </span>
                        )}
                        <span className="sr-only">Carrinho</span>
                    </Link>

                    {auth.user ? (
                        <>
                            <Link href={ordersIndex()} className="text-sm text-muted-foreground hover:text-foreground">
                                Meus pedidos
                            </Link>
                            <Button asChild size="sm">
                                <Link href={dashboard()}>Dashboard</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={login()}>Entrar</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href={register()}>Cadastrar</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}