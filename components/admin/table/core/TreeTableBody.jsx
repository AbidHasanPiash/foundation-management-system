import { Checkbox } from '@nextui-org/react';
import { flexRender } from '@tanstack/react-table';
import React from 'react';

export default function TreeTableBody({
    table,
    extractedIds,
    handlePermissionId,
}) {
    return (
        <div>
            <table className='table-auto border-collapse w-full rounded-t-md overflow-hidden'>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                            key={headerGroup.id}
                            className='bg-violet-600 text-gray-200 text-nowrap'
                        >
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className='px-4 py-2 text-left'
                                >
                                    {header.isPlaceholder ? null : (
                                        <div className='flex space-x-2'>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getCanFilter() ? (
                                                <div>
                                                    <Filter
                                                        column={header.column}
                                                        table={table}
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className='border-t border-gray-200 hover:bg-blue-300/50 even:bg-gray-100 text-nowrap'
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className='px-4 py-2 text-left flex items-center'
                                >
                                    {/* <input 
                                    type="checkbox" 
                                    name="" 
                                    id={`checkbox-${cell.id}`} 
                                    value={cell.getContext().row.original.id}
                                    checked={extractedIds.some(({ menu_id }) => menu_id === cell.getContext().row.original.id)}
                                    onChange={(e)=>handlePermissionId(e.target.value, e.target.checked)}
                                /> */}
                                    <Checkbox
                                        lineThrough
                                        id={`checkbox-${cell.id}`}
                                        value={
                                            cell.getContext().row.original.id
                                        }
                                        isSelected={extractedIds.some(
                                            ({ menu_id }) =>
                                                menu_id ===
                                                cell.getContext().row.original
                                                    .id
                                        )}
                                        onChange={(e) =>
                                            handlePermissionId(
                                                e.target.value,
                                                e.target.checked
                                            )
                                        }
                                    />
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='h-2' />
            {/* {selectedPermissionIds && JSON.stringify(extractedIds)} */}
            {/* <Pagination table={table}/> */}
            {/* <div className='p-4'>
            <div>{table.getRowModel().rows.length} Rows</div>
            <label>Row Selection State:</label>
            <pre>
                {JSON.stringify(table.getSelectedRowModel().flatRows.map((item)=>(
                    item.original.id
                )), null, 2)}
            </pre>
        </div> */}
        </div>
    );
}

function IndeterminateCheckbox({
    indeterminate,
    parentRowId,
    className = '',
    ...rest
}) {
    const ref = useRef(null);

    useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);

    return (
        <input
            type='checkbox'
            ref={ref}
            className={`${className} cursor-pointer`}
            {...rest}
            data-parent-row-id={parentRowId}
        />
    );
}

function Filter({ column, table }) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id);

    const columnFilterValue = column.getFilterValue();

    return typeof firstValue === 'number' ? (
        <div className='flex space-x-2'>
            <input
                type='number'
                value={(columnFilterValue || [])[0] ?? ''}
                onChange={(e) =>
                    column.setFilterValue((old) => [e.target.value, old?.[1]])
                }
                placeholder={`Min`}
                className='w-24 text-sm border rounded-lg px-2 py-1 text-black placeholder:text-gray-800 outline-none bg-gray-50 hover:border-sky-400'
            />
            <input
                type='number'
                value={(columnFilterValue || [])[1] ?? ''}
                onChange={(e) =>
                    column.setFilterValue((old) => [old?.[0], e.target.value])
                }
                placeholder={`Max`}
                className='w-24 text-sm border rounded-lg px-2 py-1 text-black placeholder:text-gray-800 outline-none bg-gray-50 hover:border-sky-400'
            />
        </div>
    ) : (
        <input
            type='text'
            value={columnFilterValue || ''}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder={`Search...`}
            className='w-36 text-sm border rounded-lg px-2 py-1 placeholder:font-thin placeholder:text-gray-800 outline-none bg-gray-50 hover:border-sky-400'
        />
    );
}
