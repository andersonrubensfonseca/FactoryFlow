import type { LucideIcon } from 'lucide-react';

interface Benefit {
    icon: LucideIcon;
    title: string;
}

interface BenefitsBarProps {
    benefits: Benefit[];
}

export default function BenefitsBar({ benefits }: BenefitsBarProps) {
    if (benefits.length === 0) {
        return null;
    }

    return (
        <section className="border-y border-sidebar-border/70 dark:border-sidebar-border">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
                {benefits.map(({ icon: BenefitIcon, title }) => (
                    <div key={title} className="flex flex-col items-center gap-2 text-center">
                        <BenefitIcon className="size-6 text-muted-foreground" />
                        <span className="text-sm font-medium">{title}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}