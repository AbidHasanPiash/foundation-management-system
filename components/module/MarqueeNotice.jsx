import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';

export default async function MarqueeNotice() {
    const data = await fetchDataAsServer(apiConfig?.GET_NOTICE);

    return (
        <div className='flex items-center text-sm md:text-base'>
            {/* Notice Label */}
            <div className='hidden sm:block px-3 md:px-6 py-1 md:py-2 bg-secondary text-white font-bold'>
                Notice
            </div>

            {/* Check if there are notices */}
            {data && data.length > 0 ? (
                <Marquee
                    speed={40}
                    delay={2}
                    autoFill
                    pauseOnHover
                    direction='left'
                >
                    {data.map((notice) => (
                        <Link
                            key={notice._id}
                            href={`/media/notice/${notice._id}`}
                            aria-label={`Link to notice ${notice.title}`}
                            className='hover:underline px-2 space-x-2'
                        >
                            <span>{notice.title}</span> <span>•</span>
                        </Link>
                    ))}
                </Marquee>
            ) : (
                <div className='px-4 py-2 text-gray-500'>
                    No notices available at the moment.
                </div>
            )}
        </div>
    );
}
