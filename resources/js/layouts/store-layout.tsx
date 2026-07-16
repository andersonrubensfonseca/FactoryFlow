import StoreFooter from '@/components/store/store-footer';
import StoreHeader from '@/components/store/store-header';


export default function StoreLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <StoreHeader />
            <main className="flex-1">{children}</main>
            <StoreFooter/>
        </div>
    );
}