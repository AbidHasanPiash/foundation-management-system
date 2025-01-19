'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import { BenefitsOfMembersTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function BenefitsOfMembers() {
    const { isLoading, data } = useQuery({
        queryKey: ['benefitsOfMembers'],
        queryFn: () => fetchData(apiConfig?.GET_BENEFITS_OF_MEMBERS),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Benefits of Members" />
                <AddButton link="benefits-of-members/add" />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={BenefitsOfMembersTableColumn}
            />
        </div>
    );
}
