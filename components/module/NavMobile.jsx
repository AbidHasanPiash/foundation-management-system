import React from 'react';
import { Button } from '@/components/ui/button';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';

export default function NavMobile() {
    return (
        <nav className='md:hidden'>
            <Drawer direction='left'>
                <DrawerTrigger className='h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted'>
                    <HamburgerMenuIcon className='h-[1.2rem] w-[1.2rem]' />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            <div className='text-lg sm:text-xl md:text-2xl font-bold text-primary'>
                                LOGO
                            </div>
                        </DrawerTitle>
                        <DrawerDescription>
                            This action cannot be undone.
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <DrawerClose>
                            <Button variant='outline'>Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </nav>
    );
}
