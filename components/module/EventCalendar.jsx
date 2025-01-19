'use client';
import React, { useState, useEffect } from 'react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
    HiChevronLeft,
    HiChevronRight,
    HiOutlineCalendar,
    HiOutlineClock,
} from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InvertButton } from '@/components/common/Buttons';
import Link from 'next/link';

const EventCalendar = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState([]);

    useEffect(() => {
        const days = getDaysInMonth(currentDate);
        setDaysInMonth(days);
    }, [currentDate]);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        // Fill in the days array
        const days = Array.from({ length: firstDayOfMonth }).fill(null);
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        return days;
    };

    const handlePrevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );
    };

    const handleNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );
    };

    const getEventDays = () => {
        const eventDays = new Map();
        events.forEach((event) => {
            const eventDate = new Date(event.date);
            if (
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear()
            ) {
                if (!eventDays.has(eventDate.getDate())) {
                    eventDays.set(eventDate.getDate(), []);
                }
                eventDays.get(eventDate.getDate()).push(event.title);
            }
        });
        return eventDays;
    };

    const eventDays = getEventDays();

    return (
        <Card className='w-full h-full flex flex-col space-y-2 overflow-hidden'>
            <div className='w-full py-5 relative bg-emerald-500'>
                <span className='absolute top-2 left-2 text-5xl text-white/30'>
                    <HiOutlineClock />
                </span>
                <span className='absolute -bottom-4 -right-4 -rotate-45 text-7xl text-white/30'>
                    <HiOutlineCalendar />
                </span>
                <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl text-center font-bold text-white'>
                    Event Calendar
                </h1>
            </div>
            <div className='p-4 rounded-lg flex flex-grow flex-col'>
                <div className='flex justify-between items-center mb-4'>
                    <Button
                        size='icon'
                        variant='ghost'
                        onClick={handlePrevMonth}
                    >
                        <HiChevronLeft />
                    </Button>
                    <h2 className='text-xl font-semibold'>
                        {currentDate.toLocaleString('default', {
                            month: 'long',
                        })}{' '}
                        {currentDate.getFullYear()}
                    </h2>
                    <Button
                        size='icon'
                        variant='ghost'
                        onClick={handleNextMonth}
                    >
                        <HiChevronRight />
                    </Button>
                </div>
                <div className='grid grid-cols-7 gap-1'>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                        (day) => (
                            <div key={day} className='font-bold text-center'>
                                {day}
                            </div>
                        )
                    )}
                    {daysInMonth.map((day, index) => (
                        <div
                            key={index}
                            className={`m-2 border rounded-lg text-center overflow-hidden ${day === currentDate.getDate() && currentDate.getMonth() === new Date().getMonth() ? 'border-2 border-secondary' : ''}`}
                        >
                            {day ? (
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <div
                                            className={
                                                eventDays.has(day)
                                                    ? 'bg-primary cursor-pointer'
                                                    : ''
                                            }
                                        >
                                            {day}
                                        </div>
                                    </HoverCardTrigger>
                                    {eventDays.has(day) && (
                                        <HoverCardContent align='left'>
                                            <p>
                                                {eventDays.get(day).join(', ')}
                                            </p>
                                        </HoverCardContent>
                                    )}
                                </HoverCard>
                            ) : (
                                ''
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-full flex items-center justify-center pb-2'>
                <Link href={'/event'}>
                    <InvertButton title='View All' />{' '}
                </Link>
            </div>
        </Card>
    );
};

export default EventCalendar;
