'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import { ScholarshipFormDataTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';


export default function DataTable({ formId }) {
    const { isLoading, data } = useQuery({
        queryKey: ['scholarshipFormData', formId],
        queryFn: () => fetchData(apiConfig?.GET_SCHOLARSHIP_FORM_DATA + formId + '/data'),
        enabled: !!formId,
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Scholarship Event Forms" />
                <AddButton link="scholarship/add" />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={ScholarshipFormDataTableColumn}
            />
        </div>
    );
}
