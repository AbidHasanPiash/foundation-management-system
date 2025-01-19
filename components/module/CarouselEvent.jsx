'use client';

import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {
    HiEye,
    HiOutlineCalendar,
    HiOutlineLocationMarker,
} from 'react-icons/hi';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

export default function CarouselEvent({ events }) {
    const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

    return (
        <div className='w-full h-full'>
            <Carousel
                opts={{ loop: true }}
                plugins={[plugin.current]}
                className='w-full h-[500px] sm:h-[550] md:h-[600] lg:h-[700]'
            >
                <div className='w-full h-full'>
                    <CarouselContent>
                        {events.map((item) => (
                            <CarouselItem key={item?.id} className=''>
                                <div className='w-full h-full'>
                                    <Card className='w-full h-full overflow-hidden rounded-none'>
                                        <div className='relative w-full h-full flex flex-col'>
                                            <img
                                                src={item?.image}
                                                alt={`${item?.title}'s image`}
                                                className='flex-grow object-cover h-48 w-full' // Adjust height as needed
                                            />
                                            <div className='absolute w-full bottom-0 p-2 space-y-2 bg-background'>
                                                <div className='flex items-center justify-between'>
                                                    <p className='text-base sm:text-lg md:text-xl lg:text-2xl'>
                                                        {item?.title}
                                                    </p>
                                                    <Button size='sm' asChild>
                                                        <Link
                                                            href={`event/initiatives/${item?.id}`}
                                                        >
                                                            <HiEye />{' '}
                                                            <span className='pl-2'>
                                                                View
                                                            </span>
                                                        </Link>
                                                    </Button>
                                                </div>
                                                <div className='grid grid-cols-2 gap-4'>
                                                    <p className='flex items-center space-x-2 bg-primary/40 p-2'>
                                                        <HiOutlineCalendar />
                                                        <span>
                                                            {item?.date}
                                                        </span>
                                                    </p>
                                                    <p className='flex items-center space-x-2 bg-primary/40 p-2'>
                                                        <HiOutlineLocationMarker />
                                                        <span>
                                                            {item?.place}
                                                        </span>
                                                    </p>
                                                </div>
                                                <p>{item?.description}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className='grid grid-cols-2 place-items-center'>
                        <CarouselPrevious className='border-none w-full rounded-none bg-transparent shadow-none' />
                        <CarouselNext className='border-none w-full rounded-none bg-transparent shadow-none' />
                    </div>
                </div>
            </Carousel>
        </div>
    );
}
