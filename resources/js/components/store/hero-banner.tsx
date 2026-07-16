import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

interface HeroBannerProps {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
}

export default function HeroBanner({ title, subtitle, ctaLabel, ctaHref }: HeroBannerProps) {
    return (
        <section className="relative overflow-hidden border-b border-sidebar-border/70 dark:border-sidebar-border">
            <div className="absolute inset-0">
                <PlaceholderPattern className="size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
            </div>
            <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-24">
                <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
                <p className="max-w-lg text-muted-foreground">{subtitle}</p>
                <Button asChild size="lg">
                    <Link href={ctaHref}>{ctaLabel}</Link>
                </Button>
            </div>
        </section>
    );
}