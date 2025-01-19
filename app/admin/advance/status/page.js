'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import { AllStatusTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function StatusPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['allStatus'],
        queryFn: () => fetchData(apiConfig?.GET_ALL_STATUS),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="All Status" />
                <AddButton link="status/add" />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={AllStatusTableColumn}
            />
        </div>
    );
}
