'use client';
import {
    Calendar,
    Home,
    Inbox,
    Settings,
    File,
    Info,
    CircleUserRound,
    ImagePlay,
    ChevronDown,
    UsersRound,
    Settings2,
    Tag,
    FileText,
    School,
    CircleDollarSign,
    Wallet,
    Dot,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useUser } from '@/contexts/UserContext';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '@/util/axios';
import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import Link from 'next/link';
import apiConfig from '@/configs/apiConfig';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Sidebar data structure
const initialSidebarData = [
    {
        label: 'Application',
        items: [
            { title: 'Dashboard', url: '/admin', icon: Home },
            {
                title: 'Treasury',
                icon: Wallet,
                subItems: [
                    { title: 'Donations', url: '/admin/treasury/donations' },
                    {
                        title: 'Event Budgets',
                        url: '/admin/treasury/event-budgets',
                    },
                ],
            },
            {
                title: 'Legal Documents',
                url: '/admin/legal-documents',
                icon: File,
            },
            {
                title: 'Settings',
                icon: Settings,
                subItems: [
                    { title: 'General', url: '/admin/settings/general' },
                    {
                        title: 'Message of Author',
                        url: '/admin/settings/message',
                    },
                    { title: 'Carousel', url: '/admin/settings/carousel' },
                    {
                        title: 'Payment Method',
                        url: '/admin/settings/payment-method',
                    },
                    { title: 'Categories', url: '/admin/settings/categories' },
                    {
                        title: 'Sub Categories',
                        url: '/admin/settings/sub-categories',
                    },
                ],
            },
        ],
    },
    {
        label: 'Advance',
        items: [
            { title: 'Status', url: '/admin/advance/status', icon: Settings2 },
            { title: 'Type', url: '/admin/advance/type', icon: Tag },
        ],
    },
    {
        label: 'About',
        items: [
            {
                title: 'About Us',
                icon: Info,
                subItems: [
                    { title: 'Mission', url: '/admin/about/mission' },
                    { title: 'Vision', url: '/admin/about/vision' },
                    {
                        title: 'Aim & Objective',
                        url: '/admin/about/aim-objective',
                    },
                ],
            },
            {
                title: 'Team',
                icon: CircleUserRound,
                url: '/admin/team',
            },
            {
                title: 'Membership',
                icon: UsersRound,
                subItems: [
                    { title: 'All Members', url: '/admin/member/list' },
                    {
                        title: 'Benefits of Members',
                        url: '/admin/member/benefits-of-members',
                    },
                    {
                        title: 'About Membership',
                        url: '/admin/member/about-membership',
                    },
                    {
                        title: 'Membership Criteria',
                        url: '/admin/member/membership-criteria',
                    },
                    {
                        title: 'Membership Fee',
                        url: '/admin/member/membership-fee',
                    },
                    // { title: "Membership Upgrade", url: "/admin/member/membership-upgrade" },
                ],
            },
        ],
    },
    {
        label: 'Media Center',
        items: [
            {
                title: 'Media Center',
                icon: ImagePlay,
                subItems: [
                    { title: 'Current News', url: '/admin/media/current-news' },
                    { title: 'Photo Albums', url: '/admin/media/photo-albums' },
                    { title: 'Video Albums', url: '/admin/media/video-albums' },
                    { title: 'Notice', url: '/admin/media/notice' },
                    // { title: "Press Release", url: "/admin/media/press-release" },
                    // { title: "Press Kit", url: "/admin/media/press-kit" },
                ],
            },
        ],
    },
    {
        label: 'Event Forms',
        items: [
            {
                title: 'Special Event Form',
                icon: FileText,
                subItems: [
                    { title: 'Scholarship', url: '/admin/forms/scholarship' },
                    {
                        title: 'Talent Pool & Poor',
                        url: '/admin/forms/talent-pool-poor',
                    },
                ],
            },
            {
                title: 'Eligible Institutes',
                url: '/admin/eligible/institute',
                icon: School,
            },
        ],
    },
    {
        label: 'Events',
        items: [],
        // items: [
        //   {
        //     title: "Publications",
        //     icon: Calendar,
        //     subItems: [
        //       { title: "Journals", url: "/admin/events/publications/journals" },
        //       { title: "Annual Reports", url: "/admin/events/publications/annual-reports" },
        //       { title: "Magazine", url: "/admin/events/publications/magazine" },
        //       { title: "Article", url: "/admin/events/publications/article" },
        //     ],
        //   },
        //   {
        //     title: "AWARD",
        //     icon: Calendar,
        //     subItems: [
        //       { title: "BCS ICT AWARD", url: "/admin/events/award/bcs-ict-award" },
        //     ],
        //   },
        //   {
        //     title: "Our Initiatives",
        //     icon: Calendar,
        //     subItems: [
        //       { title: "Programs", url: "/admin/events/initiatives/programs" },
        //       { title: "Training", url: "/admin/events/initiatives/training" },
        //     ],
        //   },
        // ],
    },
];

export function AppSidebar() {
    const { user } = useUser();
    const isSupperAdmin = user?.userType === 'super-admin';

    const pathname = usePathname();
    const isActive = (url) => {
        if (url === '/admin') {
            return pathname === url; // Exact match for `/admin`
        }
        return pathname.startsWith(url); // Default behavior for other routes
    };

    const isParentActive = (subItems) =>
        subItems.some((subItem) => isActive(subItem.url));

    // State for sidebar data
    const [sidebarData, setSidebarData] = useState(initialSidebarData);

    const { isLoading, data } = useQuery({
        queryKey: ['sub-category'],
        queryFn: () => fetchData(apiConfig?.GET_EVENT_SUBCATEGORY),
    });

    useEffect(() => {
        if (data) {
            // Clone the initial sidebar data to avoid mutating the original
            const newSidebarData = cloneDeep(initialSidebarData);

            // Locate the "Events" group in the sidebar structure
            const eventsGroup = newSidebarData.find(
                (group) => group.label === 'Events'
            );

            if (eventsGroup) {
                // Clear out existing items in the "Events" category to avoid duplicates
                eventsGroup.items = [];

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
                    eventsGroup.items.push({
                        title: category,
                        icon: Calendar,
                        subItems: subCategories.map((subItem) => ({
                            title: subItem.title, // Display the subCategory name
                            url: `/admin/events/${subItem.categoryId}/${subItem.id}`, // Use _id in the URL
                        })),
                    });
                }
            }

            // Update the sidebar state with the modified sidebar data
            setSidebarData(newSidebarData);
        }
    }, [data]);

    // Filtered sidebar data based on isSupperAdmin
    const filteredSidebarData = sidebarData.filter((group) => {
        // If the group label is "Advance", only include it if isSupperAdmin is true
        if (group.label === 'Advance' && !isSupperAdmin) {
            return false;
        }
        return true;
    });

    return (
        <Sidebar variant='floating'>
            <SidebarContent className='sidebar-scroll'>
                {/* Dynamic Sidebar Groups */}
                {filteredSidebarData.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) =>
                                    item.subItems ? (
                                        <Collapsible
                                            key={item.title}
                                            className='group/collapsible'
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        className={cn(
                                                            isParentActive(
                                                                item.subItems
                                                            )
                                                                ? 'text-primary hover:text-primary'
                                                                : ''
                                                        )}
                                                    >
                                                        <item.icon className='mr-1' />
                                                        {item.title}
                                                        <Dot className='ml-auto' />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.subItems.map(
                                                            (subItem) => (
                                                                <SidebarMenuSubItem
                                                                    key={
                                                                        subItem.title
                                                                    }
                                                                    className={cn(
                                                                        isActive(
                                                                            subItem.url
                                                                        )
                                                                            ? 'text-primary hover:text-primary'
                                                                            : 'text-muted-foreground'
                                                                    )}
                                                                >
                                                                    <SidebarMenuButton
                                                                        asChild
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                subItem.url
                                                                            }
                                                                        >
                                                                            {
                                                                                subItem.title
                                                                            }
                                                                        </Link>
                                                                    </SidebarMenuButton>
                                                                </SidebarMenuSubItem>
                                                            )
                                                        )}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    ) : (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                className={cn(
                                                    isActive(item.url)
                                                        ? 'text-primary hover:text-primary'
                                                        : ''
                                                )}
                                            >
                                                <Link href={item.url}>
                                                    <item.icon className='mr-1' />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}
