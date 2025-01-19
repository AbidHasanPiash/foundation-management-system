import Access from '@/components/admin/common/Access';

export const metadata = {
    title: 'Admin - Advance',
    // description: 'Abid Hasan - Frontend Developer specializing in React, Next.js, and more.',
    // image: '/image/image/hero-sm.jpg',
};

export default function Layout({ children }) {
    return <Access children={children} allowedUser={'super-admin'} />;
}
