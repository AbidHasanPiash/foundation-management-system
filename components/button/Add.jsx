'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HiPlus } from 'react-icons/hi';

export default function Add({ label = 'Add new', className, ...props }) {
    return (
        <Button
            size='sm'
            type='button'
            variant='outline'
            className={cn(
                'w-full space-x-2 border-dashed border-green-500 dark:border-green-900',
                className
            )}
            {...props}
        >
            <HiPlus className='h-4 w-4' />
            <span>{label}</span>
        </Button>
    );
}
