import React from 'react';

export default function SectionTitle({ title, designation }) {
    return (
        <div className='flex flex-col items-start space-y-1 mb-5 w-full'>
            <div className='flex space-x-2 text-nowrap'>
                <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold'>
                    {title}
                </h1>
                {designation && (
                    <p className='text-xs sm:text-sm md:text-base'>
                        {designation}
                    </p>
                )}
            </div>
            <div className='flex w-full'>
                <div className='h-0.5 w-20 sm:w-32 md:w-40 lg:w-60 bg-primary' />
            </div>
        </div>
    );
}
