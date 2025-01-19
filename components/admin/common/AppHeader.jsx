import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';
import User from './User';

export function AppHeader() {
    return (
        <div className='bg-card w-full z-30 border border-border rounded-md p-2 sticky top-2 shadow-lg flex items-center'>
            <div className='flex items-center justify-between w-full'>
                <div className='flex items-center space-x-2'>
                    <SidebarTrigger />
                    <h1 className='text-xl font-bold'>Dashboard</h1>
                </div>
                <User />
            </div>
        </div>
    );
}
