'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RiSendPlaneLine } from 'react-icons/ri';

export default function Submit({
    label = 'Submit',
    icon = <RiSendPlaneLine />,
    className,
    ...props
}) {
    return (
        <Button
            size='sm'
            type='submit'
            className={cn('space-x-2', className)}
            {...props}
        >
            {icon && React.cloneElement(icon, { className: 'h-4 w-4' })}
            <span>{label}</span>
        </Button>
    );
}
