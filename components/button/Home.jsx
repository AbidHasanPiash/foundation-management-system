'use client';
import { Button } from '@/components/ui/button';
import { GoHome } from 'react-icons/go';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

export default function Home() {
    const route = useRouter();
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size='icon'
                        variant='outline'
                        onClick={() => route.push('/')}
                    >
                        <GoHome />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Home</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
