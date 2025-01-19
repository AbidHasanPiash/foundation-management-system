import React from 'react';
import { cn } from '@/lib/utils';
import { flexRender } from '@tanstack/react-table';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import NoDataFound from '@/components/admin/common/NoDataFound';
import Spinner from '@/components/common/Spinner';

export default function ReactTableBody({
    isLoading,
    table,
    onRowClick,
    selectedRowIndex,
}) {
    const handleRowClick = (row, rowIndex) => {
        if (onRowClick) {
            onRowClick(row, rowIndex);
        }
    };

    const rows = table.getRowModel().rows;

    return (
        <Table className='w-full border text-xs'>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead
                                key={header.id}
                                colSpan={header.colSpan}
                                className={cn(
                                    'w-auto hover:bg-muted',
                                    header.column.getCanSort() &&
                                        'cursor-pointer select-none'
                                )}
                                onClick={header.column.getToggleSortingHandler()}
                            >
                                {header.isPlaceholder ? null : (
                                    <div className='flex gap-2'>
                                        <span>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </span>
                                        <span>
                                            {{ asc: '▲', desc: '▼' }[
                                                header.column.getIsSorted()
                                            ] ?? null}
                                        </span>
                                    </div>
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>

            <TableBody>
                {rows?.length > 0 ? (
                    rows.map((row, rowIndex) => (
                        <TableRow
                            key={row.id}
                            onClick={() => handleRowClick(row, rowIndex)}
                            className={cn(
                                '',
                                rowIndex === selectedRowIndex
                                    ? 'bg-primary/50 hover:bg-primary/50 text-primary text-neutral underline'
                                    : 'hover:bg-primary/10'
                            )}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={
                                table.getHeaderGroups()[0]?.headers.length || 1
                            }
                            className='text-center'
                        >
                            {isLoading ? <Spinner /> : <NoDataFound />}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
