'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HiTrash } from 'react-icons/hi';

export default function Remove({ className, ...props }) {
    return (
        <Button
            size='icon'
            type='button'
            tabIndex={-1}
            variant='destructive'
            className={cn('', className)}
            {...props}
        >
            <HiTrash className='h-4 w-4' />
        </Button>
    );
}
