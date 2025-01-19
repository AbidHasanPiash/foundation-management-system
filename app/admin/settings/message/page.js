'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import { MessageTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function MessagePage() {
    const { isLoading, data } = useQuery({
        queryKey: ['message'],
        queryFn: () => fetchData(apiConfig?.GET_MESSAGE),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Messages from Authority" />
                <AddButton link="message/add" />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={MessageTableColumn}
            />
        </div>
    );
}
