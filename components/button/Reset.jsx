'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HiOutlineRefresh } from 'react-icons/hi';

export default function Reset({
    label = 'Reset',
    icon = <HiOutlineRefresh />,
    className,
    ...props
}) {
    return (
        <Button
            size='sm'
            type='reset'
            variant='outline'
            className={cn('', className)}
            {...props}
        >
            {icon && React.cloneElement(icon, { className: 'h-4 w-4 mr-2' })}
            <span>{label}</span>
        </Button>
    );
}
