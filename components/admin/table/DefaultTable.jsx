'use client';
import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from '@tanstack/react-table';
import Pagination from './core/Pagination';
import RowsPerPage from './core/RowsPerPage';
import ReactTableBody from './core/ReactTableBody';
import GlobalSearchBox from './core/GlobalSearchBox';

export default function DefaultTable({
    list,
    column,
    isLoading,
    items = 10,
    setSelectedRow,
}) {
    const data = useMemo(() => list, [list]);
    const columns = useMemo(() => column, [column]);
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState(null);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: items,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: false,
        autoResetPageIndex: false,
        state: {
            sorting,
            pagination,
            globalFilter: filtering,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
    });

    const handleRowClick = (row, rowIndex) => {
        if (setSelectedRow) {
            if (selectedRowIndex === rowIndex) {
                // Deselect if the row is already selected
                setSelectedRowIndex(null);
                setSelectedRow(null);
            } else {
                // Select the row
                setSelectedRowIndex(rowIndex);
                setSelectedRow(row.original);
            }
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between space-x-4'>
                <GlobalSearchBox
                    filtering={filtering}
                    setFiltering={setFiltering}
                />
                <RowsPerPage table={table} pagination={pagination} />
            </div>

            <ReactTableBody
                isLoading={isLoading}
                table={table}
                onRowClick={handleRowClick}
                selectedRowIndex={selectedRowIndex}
            />

            {(table.getCanPreviousPage() || table.getCanNextPage()) && (
                <Pagination table={table} />
            )}
        </div>
    );
}
