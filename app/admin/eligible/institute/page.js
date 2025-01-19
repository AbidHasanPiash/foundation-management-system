'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import { EligibleInstituteTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function EligibleInstitutePage() {
    const { isLoading, data } = useQuery({
        queryKey: ['eligibleInstitute'],
        queryFn: () => fetchData(apiConfig?.GET_ELIGIBLE_INSTITUTE),
    });
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Eligible institute" />
                <AddButton link="institute/add" />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={EligibleInstituteTableColumn}
            />
        </div>
    );
}
