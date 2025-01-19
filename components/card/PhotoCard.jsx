import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { HiOutlineCalendar } from 'react-icons/hi';

export default function PhotoCard({ item }) {
    return (
        <Card className='overflow-hidden group'>
            <Link href={`/media/photo/${item?.id || item?._id}`}>
                <div className='w-full h-32 sm:h-40 md:h-52 lg:h-60 overflow-hidden'>
                    <img
                        src={item?.image}
                        alt={`${item?.title}'s image`}
                        className='w-full h-full object-cover group-hover:scale-105 transition-all transform duration-200'
                    />
                </div>
                <div className='p-1 md:p-2 space-y-2'>
                    <Badge variant='outline' className='space-x-2'>
                        <HiOutlineCalendar />
                        <span>{new Date(item?.date).toLocaleDateString()}</span>
                    </Badge>
                    <p className='md:text-lg lg:text-xl line-clamp-1 hover:underline'>
                        {item?.title}
                    </p>
                    {/* <p className='text-xs md:text-sm line-clamp-2'>{item?.description}</p> */}
                </div>
            </Link>
        </Card>
    );
}
