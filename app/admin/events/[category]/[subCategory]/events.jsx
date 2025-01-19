'use client';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import { EventTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function Events({ category, subCategory }) {
    const { isLoading, data } = useQuery({
        queryKey: ['events'],
        queryFn: () =>
            fetchData(
                `${apiConfig?.GET_EVENT}?subcategoryId=${subCategory}&categoryId=${category}`
            ),
    });
    return (
        <DefaultTable
            isLoading={isLoading}
            list={data || []}
            column={EventTableColumn}
        />
    );
}
