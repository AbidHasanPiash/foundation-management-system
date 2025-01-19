import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function LinkGradient({
    href = '#',
    title,
    description,
    index,
    className,
}) {
    const gradients = [
        'text-white from-red-400 via-gray-300 to-blue-500',
        'text-white from-sky-400 via-rose-400 to-lime-400',
        'text-white from-fuchsia-500 via-red-600 to-orange-400',
        'text-white from-purple-400 to-yellow-400',
        'text-white from-yellow-500 via-green-400 to-green-700',
    ];

    // Use the index to pick the gradient, ensuring it stays within bounds
    const gradient = gradients[index % gradients.length];

    return (
        <Link
            href={href}
            className={cn(
                'p-2 md:p-4 flex items-baseline space-x-2 rounded-lg',
                'animate-gradient-blink bg-gradient-to-r bg-[length:200%_200%]',
                gradient,
                className
            )}
        >
            <span className='text-lg'>{title}</span>
            <span className='text-xs'>{description && description}</span>
        </Link>
    );
}
