'use client';

import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

export default function CarouselHero({ carousel }) {
    const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

    return (
        <div className='w-full h-full my-6'>
            <Carousel
                opts={{ loop: true }}
                plugins={[plugin.current]}
                className='w-full h-full grid md:grid-cols-3 gap-4 md:gap-2'
            >
                <div className='w-full grid place-content-center md:space-y-10 space-y-4'>
                    <h1 className='space-y-2 md:space-y-4'>
                        <p className='text-primary text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold'>
                            Welcome
                        </p>
                        <p className='text-lg md:text-xl lg:text-2xl xl:text-3xl'>
                            to our Organization
                        </p>
                        <p className='text-xs'>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ea nihil voluptatum debitis enim natus in
                            totam obcaecati iure? Voluptas, veniam pariatur?
                            Qui, laboriosam illo nulla voluptates perspiciatis
                            numquam quidem modi!
                        </p>
                    </h1>
                    <div className='w-full h-full grid grid-cols-3 gap-1 sm:gap-2 md:gap-3'>
                        <Card className='w-full h-full grid place-content-center bg-mediumaquamarine/20'>
                            {' '}
                            <p>Compassion</p>{' '}
                        </Card>
                        <Card className='w-full h-full grid place-content-center bg-mediumaquamarine/20'>
                            {' '}
                            <p>Empowerment</p>{' '}
                        </Card>
                        <Card className='w-full h-full grid place-content-center bg-mediumaquamarine/20'>
                            {' '}
                            <p>Integrity</p>{' '}
                        </Card>
                    </div>
                </div>
                <div className='md:col-span-2 w-full'>
                    <CarouselContent>
                        {carousel &&
                            carousel?.map((item) => (
                                <CarouselItem key={item?.id} className=''>
                                    <div className='w-full h-full'>
                                        <Card className='w-full h-full overflow-hidden rounded-none'>
                                            <div className='relative w-full h-full flex flex-col'>
                                                <img
                                                    src={item?.image}
                                                    alt={`${item?.title}'s image`}
                                                    className='flex-grow object-cover h-48 w-full' // Adjust height as needed
                                                />
                                                <p className='absolute w-full bottom-0 p-2 bg-background'>
                                                    {item?.title}
                                                </p>
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
