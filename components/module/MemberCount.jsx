import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedCounter from '@/components/common/AnimatedCounter';

export default function MemberCount({ memberCount }) {
    const data = memberCount;
    return (
        <div
            className='w-full h-full bg-gradient-to-b from-primary to-background'
            style={{
                background:
                    'linear-gradient(to bottom, var(--tw-gradient-from) 60%, var(--tw-gradient-to) 40%)',
            }}
        >
            {/* Section Header */}
            <div className='h-1/3 grid place-content-center'>
                <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white font-bold font-satisfy'>
                    Our All Members
                </h1>
            </div>
            {/* Counter Viewer Section */}
            <Card className='h-2/3 p-0 overflow-hidden max-w-7xl mx-auto'>
                <CardContent className='w-full h-full p-0 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5'>
                    {data?.map((item, index) => (
                        <CounterViewer key={index} item={item} />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

function CounterViewer({ item }) {
    return (
        <div className='flex flex-grow flex-col items-center justify-center h-full hover:bg-muted'>
            <p className='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary'>
                <AnimatedCounter from={0} to={item?.count} />
            </p>
            <p className='text-sm sm:text-base md:text-lg text-gray-700'>
                {item?.type} Members
            </p>
        </div>
    );
}
