'use client';

import * as React from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export default function Combobox({
    data,
    icon,
    select,
    display,
    placeholder = 'Select an item',
    selectedValue,
    setSelectedValue,
}) {
    const [open, setOpen] = React.useState(false);

    // Find the selected item
    const selectedItem = data.find((item) => item?.[select] === selectedValue);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-[200px] justify-between'
                >
                    {icon && icon}
                    {selectedItem ? selectedItem[display] : placeholder}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandInput placeholder='Search...' className='h-9' />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {data &&
                                data.map((item) => (
                                    <CommandItem
                                        key={item?.[select]}
                                        value={item?.[select]} // Store the select value (e.g., id)
                                        onSelect={(currentValue) => {
                                            setSelectedValue(
                                                currentValue === selectedValue
                                                    ? ''
                                                    : currentValue
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        {item?.[display]}
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto h-4 w-4',
                                                selectedValue === item?.[select]
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
