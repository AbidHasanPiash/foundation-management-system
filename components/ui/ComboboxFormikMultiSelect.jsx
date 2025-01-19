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

export default function ComboboxFormikMultiSelect({
    data,
    icon,
    select,
    display,
    placeholder = 'Select items',
    formik,
    name,
    disable = false,
}) {
    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef(null);
    const popoverRef = React.useRef(null);
    const [triggerWidth, setTriggerWidth] = React.useState(200); // Default width

    // Update the width of the popover based on the trigger's width
    React.useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, [open]);

    // Get the selected values from Formik as an array
    const selectedValues = formik.values?.[name] || [];

    // Check if the item is selected (helper function)
    const isSelected = (item) => selectedValues.includes(item?.[select]);

    // Handle item selection
    const handleSelect = (item) => {
        const itemValue = item?.[select];
        const isAlreadySelected = selectedValues.includes(itemValue);

        const updatedValues = isAlreadySelected
            ? selectedValues.filter((id) => id !== itemValue) // Remove if already selected
            : [...selectedValues, itemValue]; // Add if not selected

        // Update Formik values
        formik.setFieldValue(name, updatedValues);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant='outline'
                    role='combobox'
                    disabled={disable}
                    aria-expanded={open}
                    className='w-full justify-between text-sm font-normal disabled:cursor-not-allowed'
                >
                    {icon && icon}
                    {selectedValues.length > 0
                        ? `Selected ${selectedValues.length} items`
                        : // .map(
                          //     (selectedId) =>
                          //         data?.find((item) => item?.[select] === selectedId)?.[display] // Display selected items
                          // )
                          // .join(", ")
                          placeholder}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                ref={popoverRef}
                className='p-0'
                style={{ width: triggerWidth }}
            >
                <Command>
                    <CommandInput placeholder='Search...' className='h-9' />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {data &&
                                data.map((item) => (
                                    <CommandItem
                                        key={item?.[select]}
                                        value={item?.[select]} // Store the select value (e.g., id)
                                        onSelect={() => handleSelect(item)}
                                    >
                                        {item?.[display]}
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto h-4 w-4',
                                                isSelected(item)
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
