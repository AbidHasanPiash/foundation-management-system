import React from 'react';
import NavDesktop from './NavDesktop';
import NavMobile from './NavMobile';
import Link from 'next/link';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { fetchDataAsServer } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';

export default async function Navigation() {
    const response = await fetchDataAsServer(apiConfig?.GET_GENERAL_INFO);

    const data = Array.isArray(response) ? response[0] : response;
    return (
        <nav className='sticky top-0 shadow py-1 px-2 z-30 space-y-2 bg-background'>
            <div className='flex items-center justify-between'>
                <div className='text-lg sm:text-xl md:text-2xl font-bold text-primary'>
                    {data?.logo && (
                        <img src={data?.logo} alt='logo' className='h-10' />
                    )}
                </div>
                <div>
                    <div className='flex items-center justify-center md:items-end md:justify-end space-x-4'>
                        <Link href={'/auth/member-login'}>Member Login</Link>
                        {/* <Link href={'#'}>Become a Member</Link> */}
                    </div>
                    <div className='flex items-end justify-end space-x-2'>
                        <ModeToggle />
                        <NavMobile />
                        <NavDesktop />
                    </div>
                </div>
            </div>
        </nav>
    );
}
