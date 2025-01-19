'use client';
import { Button } from '@/components/ui/button';
import { GoChevronLeft } from 'react-icons/go';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

export default function Back2() {
    const route = useRouter();
    return (
        <button
            size='sm'
            variant='link'
            onClick={() => route?.back()}
            className='flex items-center space-x-1'
        >
            <GoChevronLeft className='h-4 w-4' />
            <span>Back</span>
        </button>
    );
}
