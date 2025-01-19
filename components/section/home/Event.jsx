import CarouselEvent from '@/components/module/CarouselEvent';
import EventCalendar from '@/components/module/EventCalendar';
import React from 'react';

export default function Event() {
    const events = [
        {
            id: '1',
            date: '2024/10/11',
            place: 'Dhaka',
            title: 'Event 1',
            description: 'Event description will be here.',
            image: '/carousel/carousel (1).jpg',
        },
        {
            id: '2',
            date: '2024/10/12',
            place: 'Dhaka',
            title: 'Event 2',
            description: 'Event description will be here.',
            image: '/carousel/carousel (2).jpg',
        },
        {
            id: '3',
            date: '2024/10/14',
            place: 'Dhaka',
            title: 'Event 3',
            description: 'Event description will be here.',
            image: '/carousel/carousel (3).jpg',
        },
        {
            id: '4',
            date: '2024/10/12',
            place: 'Dhaka',
            title: 'Event 4',
            description: 'Event description will be here.',
            image: '/carousel/carousel (4).jpg',
        },
        {
            id: '5',
            date: '2024/10/12',
            place: 'Dhaka',
            title: 'Event 5',
            description: 'Event description will be here.',
            image: '/carousel/carousel (5).jpg',
        },
    ];

    return (
        <section className='sp'>
            <div className='max-w-7xl mx-auto grid md:grid-cols-3 gap-4'>
                <div className='md:col-start-3'>
                    <EventCalendar events={events} />
                </div>
                <div className='w-full h-full md:col-span-2 md:col-start-1 md:row-start-1'>
                    <CarouselEvent events={events} />
                </div>
            </div>
        </section>
    );
}
