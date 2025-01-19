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

export default function Back() {
    const route = useRouter();
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size='icon'
                        variant='outline'
                        onClick={() => route?.back()}
                    >
                        <GoChevronLeft />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p className='z-50'>Go back</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
