'use client';
import AddButton from '@/components/admin/button/AddButton';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import { TeamTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function TeamPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['team'],
        queryFn: () => fetchData(apiConfig?.GET_TEAM_LIST),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Team management" />
                <AddButton link="team/add" />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={TeamTableColumn}
            />
        </div>
    );
}
