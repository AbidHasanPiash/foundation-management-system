'use client';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import navigationData from '@/data/navigationData';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import Back2 from '../button/Back-2';

// Helper function to recursively find the breadcrumb path from the navigation data
const findBreadcrumbPath = (items, pathname, breadcrumbPath = []) => {
    for (const item of items) {
        const currentBreadcrumb = [...breadcrumbPath, item];

        // Check if the current item matches the pathname
        if (item.href && item.href === pathname) {
            return currentBreadcrumb;
        }

        // Check for subItems recursively
        if (item.subItems) {
            const foundPath = findBreadcrumbPath(
                item.subItems,
                pathname,
                currentBreadcrumb
            );
            if (foundPath) return foundPath;
        }
    }
    return null;
};

export default function Breadcrumbs() {
    const route = useRouter();
    const pathname = usePathname();

    // Memoize breadcrumb path to avoid recalculating on every render
    const breadcrumbPath = useMemo(() => {
        // Find the breadcrumb path based on the current pathname
        return findBreadcrumbPath(navigationData, pathname);
    }, [pathname]);

    // Handle home as a default case
    if (!breadcrumbPath || breadcrumbPath.length === 0) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink className='scale-90'>
                            {' '}
                            <Back2 />{' '}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Always show "Home" as the first breadcrumb */}
                <BreadcrumbItem>
                    <BreadcrumbLink href='/'>Home</BreadcrumbLink>
                </BreadcrumbItem>

                {breadcrumbPath.map((item, index) => (
                    <React.Fragment key={item.href || item.title}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {index === breadcrumbPath.length - 1 ? (
                                // Current page, no link
                                <BreadcrumbPage>{item.title}</BreadcrumbPage>
                            ) : (
                                // Intermediate breadcrumb, linkable
                                <BreadcrumbLink href={item.href || '#'}>
                                    {item.title}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
