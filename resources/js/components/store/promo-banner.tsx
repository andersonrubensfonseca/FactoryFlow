import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface PromoBannerProps {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
}

export default function PromoBanner({ title, subtitle, ctaLabel, ctaHref }: PromoBannerProps) {
    return (
        <section className="bg-primary text-primary-foreground">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-sm text-primary-foreground/80">{subtitle}</p>
                <Button asChild variant="secondary" size="sm">
                    <Link href={ctaHref}>{ctaLabel}</Link>
                </Button>
            </div>
        </section>
    );
}