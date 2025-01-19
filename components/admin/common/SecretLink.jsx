'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Anchor } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SecretLink({ link, className }) {
    const [clickCount, setClickCount] = useState(0);
    const [timeoutId, setTimeoutId] = useState(null);
    const router = useRouter();

    const handleClick = () => {
        // Clear any existing timeout
        if (timeoutId) clearTimeout(timeoutId);

        // Increment click count
        setClickCount((prevCount) => prevCount + 1);

        // Set a timeout to reset the count if the user pauses too long
        const newTimeoutId = setTimeout(() => {
            setClickCount(0); // Reset click count after 1 second of inactivity
        }, 1000); // Adjust timeout duration if necessary
        setTimeoutId(newTimeoutId);

        // Navigate if clicked 4 times consecutively
        if (clickCount + 1 === 4) {
            router.push(link); // Perform the action
        }
    };

    return (
        <div
            className={cn(className)}
            onClick={handleClick}
            style={{
                cursor: 'pointer',
                color: clickCount > 0 ? 'blue' : 'gray', // Optional: Visual feedback
            }}
            title='Click 4 times to activate'
        >
            <Anchor className='w-4 h-4' />
        </div>
    );
}
