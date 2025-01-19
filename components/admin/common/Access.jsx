'use client';

import Back from '@/components/button/Back';
import { Card } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { Lock } from 'lucide-react';

export default function Access({ children, allowedUser }) {
    const { user } = useUser();
    const isSupperAdmin = user?.userType === allowedUser;

    // Check if the user is not a super admin
    if (!isSupperAdmin) {
        return (
            <main className='flex flex-col items-center justify-center h-full'>
                <div className='px-20 py-8 flex flex-col items-center'>
                    <Lock className='w-16 h-16 text-red-500 mb-4' />
                    <h1 className='text-3xl font-semibold mb-2'>
                        Access Denied
                    </h1>
                    <p className='text-opacity-50 mb-6'>
                        You do not have permission to view this page.
                    </p>
                    <Back />
                </div>
            </main>
        );
    }

    return <main>{children}</main>;
}
