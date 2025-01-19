import React from 'react';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
    SelectLabel,
} from '@/components/ui/select';

export default function RowsPerPage({ table, pagination }) {
    const SIZE = [1, 5, 10, 20, 30, 40, 50];
    const [selectedKey, setSelectedKey] = React.useState(
        Number(pagination.pageSize)
    ); // Initialize with string for Select compatibility

    const handleSelectionChange = (key) => {
        setSelectedKey(key);
        table.setPageSize(Number(key));
    };

    return (
        <Select
            onValueChange={handleSelectionChange}
            defaultValue={selectedKey}
        >
            <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder={`Rows per page: ${selectedKey}`} />
            </SelectTrigger>
            <SelectContent>
                {SIZE.map((num) => (
                    <SelectItem key={num} value={num}>
                        Rows per page: {num}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
