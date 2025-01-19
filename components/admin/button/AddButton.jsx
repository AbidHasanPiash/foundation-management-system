import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HiPlus } from 'react-icons/hi';

export default function AddButton({ link = 'add', title = 'Add New' }) {
    return (
        <Link href={link}>
            <Button size='sm' variant='default' className='space-x-2'>
                <span>
                    <HiPlus className='w-4 h-4' />
                </span>
                <span>{title}</span>
            </Button>
        </Link>
    );
}
