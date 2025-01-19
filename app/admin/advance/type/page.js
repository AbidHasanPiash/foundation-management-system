'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import { AllTypeTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function TypePage() {
    const { isLoading, data } = useQuery({
        queryKey: ['allType'],
        queryFn: () => fetchData(apiConfig?.GET_ALL_TYPE),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="All Type" />
                <AddButton link="type/add" />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={AllTypeTableColumn}
            />
        </div>
    );
}
