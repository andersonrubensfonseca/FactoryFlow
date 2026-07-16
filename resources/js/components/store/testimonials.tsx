import StarRatingBasic from '@/components/commerce-ui/star-rating-basic';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
    name: string;
    quote: string;
    rating: number;
    avatarUrl?: string;
}

interface TestimonialsProps {
    testimonials: Testimonial[];
}

function getInitials(name: string) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">O que dizem nossos clientes</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                    <Card key={testimonial.name}>
                        <CardContent className="flex flex-col gap-3">
                            <StarRatingBasic value={testimonial.rating} iconSize={14} readOnly />
                            <p className="text-sm text-muted-foreground">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                                    <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{testimonial.name}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}