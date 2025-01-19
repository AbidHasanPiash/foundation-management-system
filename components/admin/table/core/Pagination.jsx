import React from 'react';
import { Button } from '@/components/ui/button';
import {
    HiChevronDoubleLeft,
    HiChevronDoubleRight,
    HiChevronLeft,
    HiChevronRight,
} from 'react-icons/hi';

export default function Pagination({ table }) {
    return (
        <div className='flex items-center justify-between gap-2 text-xs md:text-sm lg:text-base'>
            <Button variant='outline' className='text-xs'>
                <span>
                    Page {table.getState().pagination.pageIndex + 1} /{' '}
                    {table.getPageCount()}
                </span>
            </Button>

            <div className='space-x-4'>
                <Button
                    size='icon'
                    type='button'
                    title='Start'
                    variant='outline'
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <HiChevronDoubleLeft className='w-4 h-4' />
                </Button>

                <Button
                    size='icon'
                    type='button'
                    title='Previous'
                    variant='outline'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <HiChevronLeft className='w-4 h-4' />
                </Button>

                <Button
                    size='icon'
                    type='button'
                    title='Next'
                    variant='outline'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <HiChevronRight className='w-4 h-4' />
                </Button>

                <Button
                    size='icon'
                    type='button'
                    title='End'
                    variant='outline'
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <HiChevronDoubleRight className='w-4 h-4' />
                </Button>
            </div>

            <Button variant='outline'>
                <span>Go to</span>
                <input
                    type='number'
                    min='1'
                    max={table.getPageCount()}
                    className='w-fit pl-2 outline-none bg-transparent'
                    value={table.getState().pagination.pageIndex + 1}
                    onChange={(e) => {
                        const page = e.target.value
                            ? Number(e.target.value) - 1
                            : 0;
                        table.setPageIndex(page);
                    }}
                />
            </Button>
        </div>
    );
}
