import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { NavItem } from '@/types';

const institutionalLinks: NavItem[] = [
    { title: 'Sobre nós', href: '#' },
    { title: 'Política de privacidade', href: '#' },
    { title: 'Termos de uso', href: '#' },
    { title: 'Trocas e devoluções', href: '#' },
];

const socialLinks = [
    { label: 'Facebook', href: '#', icon: Facebook },
    { label: 'Instagram', href: '#', icon: Instagram },
    { label: 'Twitter', href: '#', icon: Twitter },
];

export default function StoreFooter() {
    return (
        <footer className="border-t border-sidebar-border/70 dark:border-sidebar-border">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
                <div>
                    <h3 className="mb-3 text-sm font-medium">Institucional</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {institutionalLinks.map((link) => (
                            <li key={link.title}>
                                <Link href={link.href} className="hover:text-foreground">
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-medium">Redes sociais</h3>
                    <div className="flex gap-4">
                        {socialLinks.map(({ label, href, icon: SocialIcon }) => (
                            <Link key={label} href={href} className="text-muted-foreground hover:text-foreground">
                                <SocialIcon className="size-5" />
                                <span className="sr-only">{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-medium">Formas de pagamento</h3>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Pix</Badge>
                        <Badge variant="secondary">Visa</Badge>
                        <Badge variant="secondary">Mastercard</Badge>
                        <Badge variant="secondary">Boleto</Badge>
                    </div>
                </div>
            </div>
        </footer>
    );
}