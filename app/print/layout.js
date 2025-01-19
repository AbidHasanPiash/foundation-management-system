import { cn } from '@/lib/utils';

export const metadata = {
    title: 'Print',
    // description: 'Abid Hasan - Frontend Developer specializing in React, Next.js, and more.',
    // image: '/image/image/hero-sm.jpg',
};

export default function Layout({ children }) {
    return (
        <div
            className={cn(
                "bg-gray-100 dark:bg-neutral-800",
                'h-screen w-full overflow-y-auto',
            )}
        >
            {children}
        </div>
    );
}
