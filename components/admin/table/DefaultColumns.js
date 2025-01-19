'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { FaRegCircleDot, FaRegCircleCheck } from "react-icons/fa6";
import Link from 'next/link';
import apiConfig from '@/configs/apiConfig';
import getYoutubeVideo from '@/util/getYoutubeVideo';
import DeleteDropdownMenuItem from '@/components/admin/common/DeleteDropdownMenuItem';
import StatusDropdownMenuItem from '@/components/admin/common/StatusDropdownMenuItem';
import { HiOutlinePrinter } from 'react-icons/hi';

export const DonationTableColumn = [
    {
        accessorKey: 'id',
        header: 'SN',
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'memberDetails',
        header: 'Donor Name',
        cell: ({ row }) => row.original.memberDetails?.name || 'N/A',
    },
    {
        accessorKey: 'memberDetails',
        header: 'Donor Email',
        cell: ({ row }) => row.original.memberDetails?.email || 'N/A',
    },
    {
        accessorKey: 'type',
        header: 'Type',
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
    },
    {
        accessorKey: 'updatedAt',
        header: 'Date',
        cell: ({ getValue }) => (
            <span>{new Date(getValue())?.toLocaleString()}</span>
        ),
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        accessorKey: 'bankDetails',
        header: 'Bank Name',
        cell: ({ row }) => row.original.bankDetails?.bankName || 'N/A',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(data?._id)
                            }
                        >
                            {' '}
                            Copy ID{' '}
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link
                                href={`donations/edit/${data?._id}` || '#'}
                                className="w-full"
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* <DeleteDropdownMenuItem api={apiConfig?.DELETE_DONATION} id={data?._id} query={'donation'} /> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const TeamTableColumn = [
    {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row, getValue }) => (
            <img
                src={getValue()}
                alt={`Team image ${row?.original?.id}`}
                width={20}
                height={20}
                className="rounded-full"
            />
        ),
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'typeId',
        header: 'Type',
    },
    {
        accessorKey: 'statusId',
        header: 'Status',
    },
    {
        accessorKey: 'joinDate',
        header: 'Join date',
    },
    {
        accessorKey: 'designation',
        header: 'Designation',
    },
    {
        accessorKey: 'organization',
        header: 'Organization',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(data?._id)
                            }
                        >
                            {' '}
                            Copy ID{' '}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link
                                href={`team/edit/${data?._id}`}
                                className="w-full"
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem
                            api={apiConfig?.DELETE_TEAM_COMMITTEE}
                            id={data?._id}
                            query={'team'}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const EventBudgetTableColumn = [
    {
        accessorKey: 'id',
        header: 'SN',
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'eventTitle',
        header: 'Event Name',
    },
    {
        accessorKey: 'startTime',
        header: 'Start Time',
        cell: ({ getValue }) => (
            <span>{new Date(getValue())?.toLocaleString()}</span>
        ),
    },
    {
        accessorKey: 'endTime',
        header: 'End Time',
        cell: ({ getValue }) => (
            <span>{new Date(getValue())?.toLocaleString()}</span>
        ),
    },
    {
        accessorKey: 'totalBudget',
        header: 'Budget',
        cell: ({ getValue }) => <span>${getValue()?.toLocaleString()}</span>,
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ getValue }) => <span>{getValue()?.slice(0, 50)}...</span>, // Show only first 50 characters
    },
    {
        accessorKey: 'location',
        header: 'Location',
    },
    {
        accessorKey: 'lastModified',
        header: 'Last Modified',
        cell: ({ getValue }) => (
            <span>{new Date(getValue())?.toLocaleString()}</span>
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(data?._id)
                            }
                        >
                            {' '}
                            Copy ID{' '}
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link
                                href={`event-budgets/edit/${data?._id}` || '#'}
                                className="w-full"
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link
                                href={
                                    `event-budgets/costing/${data?._id}` || '#'
                                }
                                className="w-full text-amber-500"
                            >
                                Costing
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem
                            api={apiConfig?.DELETE_BUDGET}
                            id={data?._id}
                            query={'event-budget'}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const MemberTableColumn = [
    {
        accessorKey: 'memberId',
        header: 'Member ID',
        cell: ({ getValue }) => <span>{getValue()}</span>,
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'nid',
        header: 'NID',
    },
    {
        accessorKey: 'educationalBackground',
        header: 'Education',
    },
    {
        accessorKey: 'occupation',
        header: 'Occupation',
    },
    {
        accessorKey: 'workplace',
        header: 'Workplace',
    },
    {
        accessorKey: 'designation',
        header: 'Designation',
    },
    {
        accessorKey: 'bloodGroup',
        header: 'Blood Group',
    },
    {
        accessorKey: 'dob',
        header: 'Date of Birth',
        cell: ({ getValue }) => (
            <span>{new Date(getValue()).toLocaleDateString()}</span>
        ),
    },
    {
        accessorKey: 'permanentAddress.district',
        header: 'Permanent District',
    },
    {
        accessorKey: 'currentAddress.district',
        header: 'Current District',
        cell: ({ row }) => {
            const permanentDistrict = row.original.permanentAddress?.district;
            const currentDistrict = row.original.currentAddress?.district;
            return (
                <span>
                    {currentDistrict && currentDistrict !== permanentDistrict
                        ? currentDistrict
                        : permanentDistrict}
                </span>
            );
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(data?._id)
                            }
                        >
                            {' '}
                            Copy ID{' '}
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link
                                href={`edit/${data?._id}` || '#'}
                                className="w-full"
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem
                            api={apiConfig?.DELETE_MEMBER}
                            id={data?._id}
                            query={'member'}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const EventCategoryTableColumn = [
    {
        accessorKey: 'sn',
        header: 'SN',
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'category',
        header: 'Category Name',
    },
    {
        accessorKey: 'isSpecial',
        header: 'Event Type',
        cell: ({ getValue }) => (
            <span>{getValue() ? 'Special' : 'Common'}</span>
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(data?._id)
                                }
                            >
                                {' '}
                                Copy ID{' '}
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link
                                    href={`categories/edit/${data?._id}` || '#'}
                                    className="w-full"
                                >
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem
                                api={apiConfig?.DELETE_EVENT_CATEGORY}
                                id={data?._id}
                                query={'category'}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export const EventSubcategoryTableColumn = [
    {
        accessorKey: 'sn',
        header: 'SN',
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'subCategory',
        header: 'Subcategory Name',
    },
    {
        accessorKey: 'category',
        header: 'Category Name',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(data?._id)
                                }
                            >
                                {' '}
                                Copy ID{' '}
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link
                                    href={
                                        `sub-categories/edit/${data?._id}` ||
                                        '#'
                                    }
                                    className="w-full"
                                >
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem
                                api={apiConfig?.DELETE_EVENT_SUBCATEGORY}
                                id={data?._id}
                                query={'sub-category'}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export const EventTableColumn = [
    {
        accessorKey: 'sn',
        header: 'SN',
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'eventDate',
        header: 'Event Date',
        cell: ({ getValue }) => (
            <span>{new Date(getValue()).toLocaleDateString()}</span>
        ),
    },
    {
        accessorKey: 'statusId',
        header: 'Status',
    },
    {
        accessorKey: 'files',
        header: 'Files',
        cell: ({ getValue }) => <span>{getValue()?.length}</span>,
    },
    {
        accessorKey: 'links',
        header: 'Links',
        cell: ({ getValue }) => <span>{getValue()?.length}</span>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;
            const pathname = usePathname();

            return (
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(data?._id)
                                }
                            >
                                {' '}
                                Copy ID{' '}
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link
                                    href={
                                        `${pathname}/edit/${data?._id}` || '#'
                                    }
                                    className="w-full"
                                >
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem
                                api={apiConfig?.DELETE_EVENT}
                                id={data?._id}
                                query={'events'}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export const NewsAlbumTableColumn = [
    {
        accessorKey: 'banner',
        header: 'Banner',
        cell: ({ row, getValue }) => (
            <img
                src={getValue()}
                alt={`Banner image ${row?.original?.id}`}
                width={20}
                height={20}
                className="w-24 h-14 object-cover rounded"
            />
        ),
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'createdAt',
        header: 'Publish Date',
        cell: ({ getValue }) => (
            <span>{new Date(getValue()).toLocaleDateString()}</span>
        ),
    },
    {
        accessorKey: 'updatedAt',
        header: 'Update Date',
        cell: ({ getValue }) => (
            <span>{new Date(getValue()).toLocaleDateString()}</span>
        ),
    },
    {
        accessorKey: 'files',
        header: 'Files',
        cell: ({ getValue }) => <span>{getValue()?.length}</span>,
    },
    {
        accessorKey: 'links',
        header: 'Links',
        cell: ({ getValue }) => <span>{getValue()?.length}</span>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(data?._id)
                            }
                        >
                            {' '}
                            Copy ID{' '}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link
                                href={`current-news/edit/${data?._id}`}
                                className="w-full"
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem
                            api={apiConfig?.DELETE_NEWS}
                            id={data?._id}
                            query={'current-news'}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const NoticeAlbumTableColumn = [
    {
        accessorKey: 'sn',
        header: 'SN',
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'publishDate',
        header: 'Publish Date',
        cell: ({ getValue }) => (
            <span>{new Date(getValue()).toLocaleDateString()}</span>
        ),
    },
    {
        accessorKey: 'file',
        header: 'File Name',
        cell: ({ getValue }) => <span>{getValue()?.name}</span>,
    },
    {
        accessorKey: 'link',
        header: 'Link Name',
        cell: ({ getValue }) => <span>{getValue()?.name}</span>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(data?._id)
                            }
                        >
                            {' '}
                            Copy ID{' '}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link
                                href={`notice/edit/${data?._id}`}
                                className="w-full"
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem
                            api={apiConfig?.DELETE_NOTICE}
                            id={data?._id}
                            query={'notice'}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const PhotoAlbumTableColumn = [
    {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row, getValue }) => (
            <img
                src={getValue()}
                alt={`Team image ${row?.original?.id}`}
                width={20}
                height={20}
                className="w-24 h-14 object-cover rounded-full"
            />
        ),
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        accessorKey: 'date',
        header: 'Date',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(data?._id)
                            }
                        >
                            {' '}
                            Copy ID{' '}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link
                                href={`photo-albums/edit/${data?._id}`}
                                className="w-full"
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem
                            api={apiConfig?.DELETE_PHOTO}
                            id={data?._id}
                            query={'photo'}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const VideoAlbumTableColumn = [
    {
        accessorKey: 'link',
        header: 'Video',
        cell: ({ row, getValue }) => {
            // Extracted YouTube video ID from the provided URL
            const videoId = getYoutubeVideo.id(getValue());
            const videoThumbnail = getYoutubeVideo.thumbnail(videoId);

            return (
                <div>
                    {videoId ? (
                        <Link href={getValue()} target="_blank">
                            <img
                                src={videoThumbnail}
                                alt={`YouTube Thumbnail ${row?.original?.id}`}
                                className="w-24 h-14 object-cover cursor-pointer rounded-md shadow-md hover:opacity-80"
                            />
                        </Link>
                    ) : (
                        <p>Invalid YouTube link</p>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        accessorKey: 'date',
        header: 'Date',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(data?._id)
                            }
                        >
                            {' '}
                            Copy ID{' '}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link
                                href={`video-albums/edit/${data?._id}`}
                                className="w-full"
                            >
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem
                            api={apiConfig?.DELETE_VIDEO}
                            id={data?._id}
                            query={'video'}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const BenefitsOfMembersTableColumn = [
    {
        accessorKey: 'sn',
        header: 'SN',
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'text',
        header: 'Benefit',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(data?._id)
                                }
                            >
                                {' '}
                                Copy ID{' '}
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link
                                    href={
                                        `benefits-of-members/edit/${data?._id}` ||
                                        '#'
                                    }
                                    className="w-full"
                                >
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem
                                api={apiConfig?.DELETE_BENEFITS_OF_MEMBERS}
                                id={data?._id}
                                query={'benefitsOfMembers'}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export const MessageTableColumn = [
    {
        accessorKey: 'sn',
        header: 'SN',
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row, getValue }) => (
            <img
                src={getValue()}
                alt={`Message image ${row?.original?._id}`}
                width={20}
                height={20}
                className="rounded-full"
            />
        ),
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'message',
        header: 'Message',
        cell: ({ getValue }) => <span>{getValue().slice(0, 50)}...</span>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(data?._id)
                                }
                            >
                                {' '}
                                Copy ID{' '}
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link
                                    href={`message/edit/${data?._id}` || '#'}
                                    className="w-full"
                                >
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem
                                api={apiConfig?.DELETE_MESSAGE}
                                id={data?._id}
                                query={'message'}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export const ScholarshipFormTableColumn = [
    {
        accessorKey: 'sn',
        header: 'SN',
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'slNo',
        header: 'Form No.',
    },
    {
        accessorKey: 'formTitle',
        header: 'Title',
    },
    {
        accessorKey: 'formName',
        header: 'Name',
    },
    {
        accessorKey: 'venue',
        header: 'Venue',
    },
    {
        accessorKey: 'createdAt',
        header: 'Create Date',
        cell: ({ getValue }) => (
            <span>{new Date(getValue()).toLocaleDateString()}</span>
        ),
    },
    {
        accessorKey: 'lastDate',
        header: 'Last Date',
        cell: ({ getValue }) => (
            <span>{new Date(getValue()).toLocaleDateString()}</span>
        ),
    },
    {
        accessorKey: 'eligibleSchools',
        header: 'Eligible Schools',
        cell: ({ getValue }) => <span>{getValue().length}</span>,
    },
    {
        accessorKey: 'exam',
        header: 'Exam subject',
        cell: ({ getValue }) => <span>{getValue().length}</span>,
    },
    {
        accessorKey: 'data',
        header: 'Applications',
        cell: ({ getValue }) => <span>{getValue().length}</span>,
    },
    {
        accessorKey: 'isActive',
        header: 'Active Status',
        cell: ({ getValue }) => <span>{getValue() ? <FaRegCircleCheck className='w-4 h-4 text-green-500' /> : <FaRegCircleDot className='w-4 h-4 text-red-500' />}</span>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(data?._id)
                                }
                            >
                                {' '}
                                Copy ID{' '}
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link
                                    href={
                                        `scholarship/edit/${data?._id}` || '#'
                                    }
                                    className="w-full"
                                >
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <StatusDropdownMenuItem
                                api={apiConfig?.UPDATE_SCHOLARSHIP_FORM + data?._id}
                                data={{
                                    isActive: !data?.isActive,
                                }}
                                query={'scholarship'}
                                actionText={data?.isActive 
                                    ? 'Deactivate' 
                                    : 'Activate'}
                                dialogTitle={data?.isActive 
                                    ? 'Activate this event?' 
                                    : 'Deactivate this event?'}
                                dialogDescription={data?.isActive 
                                    ? 'This action will make it public for end user' 
                                    : 'This action will make it hidden for end user'}
                            />

                            <DropdownMenuItem>
                                <Link
                                    href={
                                        `scholarship/data/${data?._id}` || '#'
                                    }
                                    className="w-full"
                                >
                                    Show Applications
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem
                                api={apiConfig?.DELETE_SCHOLARSHIP_FORM}
                                id={data?._id}
                                query={'scholarship'}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export const ScholarshipFormDataTableColumn = [
    {
        accessorKey: 'slNo',
        header: 'SN',
    },
    {
        accessorKey: 'applicantNameEn',
        header: 'Applicant Name En',
    },
    {
        accessorKey: 'applicantNameBn',
        header: 'Applicant Name Bn',
    },
    {
        accessorKey: 'schoolName',
        header: 'School Name',
    },
    {
        accessorKey: 'classRollNo',
        header: 'Class Roll',
    },
    {
        accessorKey: 'contact',
        header: 'Contact',
    },
    {
        accessorKey: 'permanentAddress',
        header: 'Permanent Address',
        cell: ({ getValue }) => (
            <span>{getValue()?.village}, {getValue()?.subdistrict}</span>
        ),
    },
    {
        accessorKey: 'currentAddress',
        header: 'Current Address',
        cell: ({ getValue }) => (
            <span>{getValue()?.village}, {getValue()?.subdistrict}</span>
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;
            const pathname = usePathname();
            const formId = pathname.split('/').pop();

            return (
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(data?._id)
                                }
                            >
                                {' '}
                                Copy ID{' '}
                            </DropdownMenuItem>

                            <DropdownMenuItem disabled>
                                <Link
                                    href={
                                        `scholarship/edit/${data?._id}` || '#'
                                    }
                                    className="w-full"
                                >
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <StatusDropdownMenuItem
                                api={apiConfig?.UPDATE_SCHOLARSHIP_FORM_DATA + formId + '/data/' + data?._id}
                                data={{
                                    isActive: !data?.isActive,
                                }}
                                query={'scholarshipFormData'}
                                actionText={data?.isActive 
                                    ? 'Reject' 
                                    : 'Select'}
                                dialogTitle={data?.isActive 
                                    ? 'Select this application?' 
                                    : 'Reject this application?'}
                                dialogDescription={data?.isActive 
                                    ? 'This action will select this application' 
                                    : 'This action will reject this application'}
                            />

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <Link
                                    href={
                                        `/print/application/${formId}/${data?._id}` || '#'
                                    }
                                    target='_blank'
                                    className="w-full flex items-center justify-between"
                                >
                                    <span>Print</span> <HiOutlinePrinter />
                                </Link>
                            </DropdownMenuItem>

                            {/* <DeleteDropdownMenuItem
                                api={apiConfig?.DELETE_SCHOLARSHIP_FORM}
                                id={data?._id}
                                query={'scholarshipFormData'}
                            /> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export const EligibleInstituteTableColumn = [
    {
        accessorKey: 'sn',
        header: 'SN',
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'contactPerson',
        header: 'Contact Person',
    },
    {
        accessorKey: 'contactNo',
        header: 'Phone',
    },
    {
        accessorKey: 'headOfInstitute',
        header: 'Head Of Institute',
    },
    {
        accessorKey: 'headOfInstituteNumber',
        header: 'Head Of Institute Phone',
    },
    {
        accessorKey: 'address',
        header: 'Address',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(data?._id)
                                }
                            >
                                {' '}
                                Copy ID{' '}
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link
                                    href={`institute/edit/${data?._id}` || '#'}
                                    className="w-full"
                                >
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem
                                api={apiConfig?.DELETE_ELIGIBLE_INSTITUTE}
                                id={data?._id}
                                query={'eligibleInstitute'}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export const PaymentMethodTableColumn = [
    {
        accessorKey: 'sn',
        header: 'SN',
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'type',
        header: 'Method',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(data?._id)
                                }
                            >
                                {' '}
                                Copy ID{' '}
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link
                                    href={
                                        `payment-method/edit/${data?._id}` ||
                                        '#'
                                    }
                                    className="w-full"
                                >
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem
                                api={apiConfig?.DELETE_PAYMENT_METHOD}
                                id={data?._id}
                                query={'payment-method'}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export const AllStatusTableColumn = [
    {
        accessorKey: 'sn',
        header: 'SN',
        cell: ({ row }) => <span className="w-fit">{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        accessorKey: 'category',
        header: 'Category',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(data?._id)
                                }
                            >
                                {' '}
                                Copy ID{' '}
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link
                                    href={
                                        `status/edit/${data?.category}/${data?._id}` ||
                                        '#'
                                    }
                                    className="w-full"
                                >
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem
                                api={apiConfig?.DELETE_STATUS_BY_CATEGORY}
                                id={`${data?.category}/${data?._id}`}
                                query={'allStatus'}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

export const AllTypeTableColumn = [
    {
        accessorKey: 'sn',
        header: 'SN',
        cell: ({ row }) => <span className="w-fit">{Number(row?.id) + 1}</span>,
    },
    {
        accessorKey: 'type',
        header: 'Type',
    },
    {
        accessorKey: 'category',
        header: 'Category',
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            return (
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(data?._id)
                                }
                            >
                                {' '}
                                Copy ID{' '}
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link
                                    href={
                                        `type/edit/${data?.category}/${data?._id}` ||
                                        '#'
                                    }
                                    className="w-full"
                                >
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem
                                api={apiConfig?.DELETE_TYPE_BY_CATEGORY}
                                id={`${data?.category}/${data?._id}`}
                                query={'allType'}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
