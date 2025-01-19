import React from 'react';
import { AiOutlineInbox } from 'react-icons/ai'; // Example: React Icons

export default function NoDataFound() {
    return (
        <div className='flex flex-col items-center justify-center h-full text-center p-6 space-y-4'>
            <AiOutlineInbox className='text-muted-foreground w-16 h-16' />
            <h1 className='text-xl font-semibold text-muted-foreground'>
                No Data Found
            </h1>
            <p className='text-muted-foreground'>
                We couldn't find any relevant data at the moment. Please check
                back later.
            </p>
        </div>
    );
}
