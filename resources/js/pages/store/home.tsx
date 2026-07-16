import { Head } from '@inertiajs/react';
import { CreditCard, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import BenefitsBar from '@/components/store/benefits-bar';
import FeaturedCategories from '@/components/store/featured-categories';
import HeroBanner from '@/components/store/hero-banner';
import Newsletter from '@/components/store/newsletter';
import type { Product } from '@/components/store/product-card';
import ProductGrid from '@/components/store/product-grid';
import PromoBanner from '@/components/store/promo-banner';
import Testimonials from '@/components/store/testimonials';

interface HomeProps {
    categories: { title: string; href: string }[];
    featuredProducts: Product[];
    productsHref: string;
}

export default function Home({ categories, featuredProducts, productsHref }: HomeProps) {
    return (
        <>
            <Head title="Início" />
            <HeroBanner
                title="Bem-vindo à loja"
                subtitle="Os melhores produtos, direto pra você."
                ctaLabel="Ver produtos"
                ctaHref={productsHref}
            />
            <FeaturedCategories
                categories={categories}
            />
            <ProductGrid
                title="Mais vendidos"
                products={featuredProducts}
            />
            <PromoBanner
                title="Frete grátis acima de R$ 199"
                subtitle="Válido para todo o Brasil, sem cupom necessário"
                ctaLabel="Aproveitar"
                ctaHref={productsHref}
            />
            <Testimonials
                testimonials={[
                    { name: 'Ana Silva', quote: 'Entrega rápida e produto de qualidade.', rating: 5 },
                    { name: 'Bruno Costa', quote: 'Ótimo atendimento, recomendo.', rating: 4 },
                ]}
            />
            <BenefitsBar
                benefits={[
                    { icon: Truck, title: 'Frete grátis' },
                    { icon: CreditCard, title: 'Parcelamento em até 12x' },
                    { icon: ShieldCheck, title: 'Garantia de 90 dias' },
                    { icon: RefreshCw, title: 'Troca fácil' },
                ]}
            />
            <Newsletter/>
        </>
    );
}