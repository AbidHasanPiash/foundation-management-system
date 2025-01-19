import NoDataFound from '@/components/admin/common/NoDataFound';
import { Badge } from '@/components/ui/badge';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';
import Link from 'next/link';
import React from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';

export default async function NoticeDetailsPage({ params }) {
    const { id } = params;
    const data = await fetchDataAsServer(apiConfig?.GET_NOTICE_BY_ID + id);

    // Utility function to determine file type
    const isImage = (fileUrl) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const extension = fileUrl?.split('.').pop()?.toLowerCase();
        return imageExtensions.includes(extension);
    };

    return !data ? (
        <NoDataFound />
    ) : (
        <div className="space-y-4">
            {/* Publish Date */}
            <div className="flex justify-between flex-col md:flex-row gap-2">
                <p className="text-3xl">{data?.title}</p>
                <Badge variant="outline" className="space-x-2 w-fit">
                    <HiOutlineCalendar />
                    <span>
                        {new Date(data?.publishDate).toLocaleDateString()}
                    </span>
                </Badge>
            </div>

            {/* Additional Links */}
            {data?.link && (
                <div className="flex items-center space-x-2">
                    <p className="font-semibold text-lg mb-2">
                        Additional Links:
                    </p>
                    <Link
                        href={data?.link || '#'}
                        className="hover:underline hover:text-blue-500"
                    >
                        {data?.linkName}
                    </Link>
                </div>
            )}

            {/* File Viewer */}
            {data?.fileLink && (
                <div className="mt-6">
                    <p className="font-semibold text-lg mb-4">
                        Attached Document: {data?.fileName}
                    </p>
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                        {isImage(data.fileLink) ? (
                            <img
                                src={data.fileLink}
                                alt="Attached file"
                                className="w-full h-auto object-contain"
                            />
                        ) : (
                            <iframe
                                src={data.fileLink}
                                className="w-full h-screen"
                                frameBorder="0"
                            ></iframe>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
