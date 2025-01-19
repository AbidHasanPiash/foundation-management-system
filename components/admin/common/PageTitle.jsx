import Back3 from '@/components/button/Back-3';
import React from 'react';

export default function PageTitle({
    title = '',
    description = '',
    back = true,
}) {
    return (
        <div className='flex items-center space-x-2'>
            {back && <Back3 />}
            <div className='flex items-end w-fit space-x-2'>
                <h2 className='text-lg md:text-xl font-semibold'>{title}</h2>
                <p className='pb-px'>{description}</p>
            </div>
        </div>
    );
}
