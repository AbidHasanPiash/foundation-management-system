import NoDataFound from '@/components/admin/common/NoDataFound';
import CoverAbout from '@/components/common/CoverAbout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';
import Link from 'next/link';
import React from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';

export default async function AwardPage({ params }) {
    const { id } = params;
    const data = await fetchDataAsServer(apiConfig?.GET_EVENT_BY_ID + id);
    return !data ? (
        <NoDataFound />
    ) : (
        <div className="space-y-10">
            <CoverAbout data={data} />
            {JSON.stringify(data)}
            <div className="w-full grid gap-2">
                <div className="flex items-center justify-between">
                    <div>
                        {data?.specialFormId && (
                            <Button>
                                <Link
                                    href={`/application/${data?.specialFormId}`}
                                >
                                    Apply Now
                                </Link>
                            </Button>
                        )}
                    </div>
                    <div className="flex items-end justify-end">
                        <Badge variant="outline" className="space-x-2">
                            <HiOutlineCalendar />
                            <span>{data?.eventDate}</span>
                        </Badge>
                    </div>
                </div>
                <div>
                    {/* Additional Links */}
                    {data?.links?.length > 0 && (
                        <div>
                            <p className="font-semibold text-lg mb-2">
                                Additional Links:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                {data.links.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.link || '#'}
                                            target="_blank"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {link?.name || 'Visit'}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Additional Files */}
                    {data?.files?.length > 0 && (
                        <div>
                            <p className="font-semibold text-lg mb-2">
                                Additional Files:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                {data.files.map((file, index) => (
                                    <li key={index}>
                                        <Link
                                            href={file.link || '#'}
                                            download
                                            target="_blank"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {file?.name || 'Download'}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="md:text-base sun-editor-content text-foreground w-full overflow-x-auto">
                {/* Rendering HTML content from description */}
                <div dangerouslySetInnerHTML={{ __html: data?.description }} />
            </div>
        </div>
    );
}
