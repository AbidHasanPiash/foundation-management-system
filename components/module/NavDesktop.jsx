'use client';

import * as React from 'react';
import Link from 'next/link';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { getNavigationData } from '@/data/navigationData';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import { cloneDeep } from 'lodash';

const initialNavData = [
    { title: 'Home', href: '/' },
    {
        title: 'About',
        subItems: [
            { title: 'Mission', href: '/about/mission' },
            { title: 'Vision', href: '/about/vision' },
            { title: 'Aim & Objective', href: '/about/aim' },
        ],
    },
    {
        title: 'Team',
        subItems: [
            { title: 'Executive Committee', href: '/team/executive' },
            { title: 'Working Committee', href: '/team/working' },
            { title: 'Ex. Executive Committee', href: '/team/ex-executive' },
            { title: 'Ex. Working Committee', href: '/team/ex-working' },
        ],
    },
    { title: 'Legal Document', href: '/legal-document' },
    {
        title: 'Membership',
        subItems: [
            { title: 'Member List', href: '/member/list' },
            { title: 'About Membership', href: '/member/about-membership' },
            {
                title: 'Membership Criteria',
                href: '/member/membership-criteria',
            },
            { title: 'Membership Fee', href: '/member/membership-fee' },
            { title: 'Membership Upgrade', href: '/member/membership-upgrade' },
        ],
    },
    {
        title: 'Events',
        subItems: [],
        // subItems: [
        //     {
        //         title: "Publications", subItems: [
        //             { title: "Journals", href: "/event/publication/journals" },
        //             { title: "Annual Reports", href: "/event/publication/annual-reports" },
        //             { title: "Magazine", href: "/event/publication/magazine" },
        //             { title: "Article", href: "/event/publication/article" },
        //         ]
        //     },
        //     {
        //         title: "AWARD", subItems: [
        //             { title: "BCS ICT AWARD", href: "/event/award/bcs-ict-award" },
        //         ]
        //     },
        //     {
        //         title: "Our Initiatives", subItems: [
        //             { title: "Programs", href: "/event/initiatives/programs" },
        //             { title: "Training", href: "/event/initiatives/training" },
        //         ]
        //     },
        // ]
    },
    {
        title: 'Media Center',
        subItems: [
            { title: 'Current News', href: '/media/current-news' },
            { title: 'Photo Albums', href: '/media/photo' },
            { title: 'Video Albums', href: '/media/video' },
            { title: 'Notice', href: '/media/notice' },
            // { title: "Press Release", href: "/media/press-release" },
            // { title: "Press Kit", href: "/media/press-kit" },
        ],
    },
    { title: 'Contact', href: '/contact' },
];

export default function NavDesktop() {
    // const navigationItems =  getNavigationData()

    // State for sidebar data
    const [navigationItems, setNavigationItems] =
        React.useState(initialNavData);

    const { isLoading, data } = useQuery({
        queryKey: ['sub-category'],
        queryFn: () => fetchData(apiConfig?.GET_EVENT_SUBCATEGORY),
    });

    React.useEffect(() => {
        if (data) {
            // Clone the initial sidebar data to avoid mutating the original
            const newSidebarData = cloneDeep(initialNavData);

            // Locate the "Events" group in the sidebar structure
            const eventsGroup = newSidebarData.find(
                (group) => group.title === 'Events'
            );

            if (eventsGroup) {
                // Clear out existing items in the "Events" category to avoid duplicates
                eventsGroup.subItems = [];

                // Organize the API data by category, mapping each subcategory and its _id to the category
                const categoryMap = data.reduce((acc, item) => {
                    const categoryKey = item.category || 'Uncategorized'; // Handle any items without a category
                    if (!acc[categoryKey]) acc[categoryKey] = [];
                    acc[categoryKey].push({
                        title: item.subCategory,
                        id: item._id,
                        categoryId: item?.categoryId,
                    });
                    return acc;
                }, {});

                // Convert categoryMap into the sidebar format
                for (const [category, subCategories] of Object.entries(
                    categoryMap
                )) {
                    eventsGroup.subItems.push({
                        title: category,
                        subItems: subCategories.map((subItem) => ({
                            title: subItem.title, // Display the subCategory name
                            href: `/event/${subItem.categoryId}/${subItem.id}`, // Use _id in the URL
                        })),
                    });
                }
            }

            // Update the sidebar state with the modified sidebar data
            setNavigationItems(newSidebarData);
        }
    }, [data]);

    return (
        <div className='hidden md:block'>
            <Menubar>
                {navigationItems.map((item) => (
                    <MenubarMenu key={item.title}>
                        {item.subItems ? (
                            <MenubarTrigger>{item.title}</MenubarTrigger>
                        ) : (
                            // Wrap top-level item with no subItems in a Link
                            <Link href={item.href} passHref>
                                <MenubarTrigger>{item.title}</MenubarTrigger>
                            </Link>
                        )}
                        {item.subItems && (
                            <MenubarContent>
                                {item.subItems.map((subItem) => {
                                    return subItem?.subItems ? (
                                        <MenubarSub key={subItem.title}>
                                            <MenubarSubTrigger>
                                                {subItem.title}
                                            </MenubarSubTrigger>
                                            <MenubarSubContent>
                                                {subItem.subItems.map(
                                                    (nestedSubItem) => (
                                                        <MenubarItem
                                                            key={
                                                                nestedSubItem.title
                                                            }
                                                            asChild
                                                        >
                                                            <Link
                                                                href={
                                                                    nestedSubItem.href ||
                                                                    '#'
                                                                }
                                                            >
                                                                {
                                                                    nestedSubItem.title
                                                                }
                                                            </Link>
                                                        </MenubarItem>
                                                    )
                                                )}
                                            </MenubarSubContent>
                                        </MenubarSub>
                                    ) : (
                                        <MenubarItem
                                            key={subItem.title}
                                            asChild
                                        >
                                            <Link href={subItem.href || '#'}>
                                                {subItem.title}
                                            </Link>
                                        </MenubarItem>
                                    );
                                })}
                            </MenubarContent>
                        )}
                    </MenubarMenu>
                ))}
            </Menubar>
        </div>
    );
}
