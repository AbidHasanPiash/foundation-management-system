import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HiPencil } from 'react-icons/hi';
import { toast } from 'sonner';

export default function EditButton({ title = 'Edit', link, selectedRow }) {
    // Click handler for cases when no item is selected
    const handleClick = () => {
        if (!selectedRow) {
            toast.warning('Please select an item first!');
        }
    };

    return selectedRow ? (
        <Link href={link || '#'} passHref>
            <Button
                size='sm'
                variant='default'
                className='bg-amber-500 hover:bg-amber-500/80 space-x-2 flex items-center'
            >
                <HiPencil className='w-4 h-4' />
                <span>{title}</span>
            </Button>
        </Link>
    ) : (
        <Button
            size='sm'
            variant='default'
            onClick={handleClick}
            className='bg-amber-500 hover:bg-amber-500/80 space-x-2 flex items-center'
        >
            <HiPencil className='w-4 h-4' />
            <span>{title}</span>
        </Button>
    );
}
