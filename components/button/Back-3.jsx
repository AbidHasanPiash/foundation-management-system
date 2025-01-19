'use client';

import { GoChevronLeft } from 'react-icons/go';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '../ui/button';

export default function Back3() {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'Backspace') {
                router?.back();
            }
        };

        // Attach the event listener to the document
        document.addEventListener('keydown', handleKeyDown);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [router]);

    return (
        <Button size='icon' variant='outline' onClick={() => router?.back()}>
            <GoChevronLeft className='w-5 h-5' />
        </Button>
    );
}
