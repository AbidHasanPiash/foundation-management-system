import { Input } from '@/components/ui/input';
import { RiSearchLine } from 'react-icons/ri';

export default function GlobalSearchBox({ filtering, setFiltering }) {
    return (
        <div className='relative max-w-sm w-full'>
            <RiSearchLine className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <Input
                aria-label='Search'
                placeholder='Search here...'
                value={filtering || ''}
                onChange={(e) => setFiltering(e.target.value)}
                className='pl-9 w-full'
            />
        </div>
    );
}
