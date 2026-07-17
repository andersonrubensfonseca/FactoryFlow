import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Package, Tags, Palette, ClipboardList, Truck } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as adminCategoriesIndex } from '@/routes/admin/categories';
import { index as adminProductsIndex } from '@/routes/admin/products';
import { edit as themeEdit } from '@/routes/admin/theme';
import { index as adminOrdersIndex } from '@/routes/admin/orders';
import { status as melhorEnvioStatus } from '@/routes/admin/melhor-envio';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (auth.user.is_admin) {
        mainNavItems.push(
            { title: 'Categorias', href: adminCategoriesIndex(), icon: Tags },
            { title: 'Produtos', href: adminProductsIndex(), icon: Package },
            { title: 'Pedidos', href: adminOrdersIndex(), icon: ClipboardList },
            { title: 'Melhor Envio', href: melhorEnvioStatus(), icon: Truck },
            { title: 'Paleta de cores', href: themeEdit(), icon: Palette },
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
