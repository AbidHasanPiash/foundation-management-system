import React from 'react';

export default function CoverAbout({ data }) {
    return (
        <div className='relative w-full h-[100px] sm:h-[150px] md:h-[200px] lg:h-[300px] xl:h-[350px] overflow-hidden bg-gray-200'>
            {/* Overlay with gradient */}
            <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-75'></div>

            {/* Image */}
            <img
                src={data?.banner}
                alt='Cover Photo'
                className='w-full h-full object-cover'
            />

            {/* Text Content */}
            <div className='absolute inset-0 flex items-center justify-center z-20'>
                <h1 className='text-4xl md:text-6xl text-white font-bold shadow-lg'>
                    {data?.title}
                </h1>
            </div>
        </div>
    );
}
