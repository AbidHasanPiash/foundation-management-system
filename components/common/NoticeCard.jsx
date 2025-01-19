import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { HiDownload, HiOutlineCalendar } from 'react-icons/hi';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function NoticeCard({ item }) {
    return (
        <Card>
            <div className='flex items-center justify-between p-2 sm:p-3 md:p-4 hover:bg-muted'>
                <Link href={`/media/notice/${item?._id}`} className='flex-grow'>
                    <div className='space-y-2'>
                        <CardDescription className='flex items-center space-x-2'>
                            <HiOutlineCalendar />
                            <span>
                                {new Date(
                                    item?.publishDate
                                ).toLocaleDateString()}
                            </span>
                        </CardDescription>
                        <CardTitle>{item?.title}</CardTitle>
                        {item?.link && (
                            <div className='flex items-center space-x-2'>
                                <p>Additional Links:</p>
                                <Link
                                    href={item?.link || '#'}
                                    className='hover:underline hover:text-blue-500'
                                >
                                    {item?.linkName}
                                </Link>
                            </div>
                        )}
                    </div>
                </Link>
                {item?.fileLink && (
                    <div className='ml-4'>
                        <Link
                            href={item?.fileLink}
                            target='_blank'
                            passHref
                            legacyBehavior
                        >
                            <Button
                                as='a'
                                aria-label='Download file'
                                className='space-x-2'
                            >
                                <HiDownload className='w-4 h-4' />
                                <span>{item?.fileName}</span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </Card>
    );
}
