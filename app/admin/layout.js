import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/admin/common/AppSidebar';
import { AppHeader } from '@/components/admin/common/AppHeader';
import { Card } from '@/components/ui/card';

export const metadata = {
    title: 'Admin - dashboard',
    // description: 'Abid Hasan - Frontend Developer specializing in React, Next.js, and more.',
    // image: '/image/image/hero-sm.jpg',
};

export default function Layout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="p-2 min-h-screen w-full space-y-4 flex flex-col">
                <AppHeader />
                <Card className="p-2 md:p-4 flex-grow">{children}</Card>
            </main>
        </SidebarProvider>
    );
}
