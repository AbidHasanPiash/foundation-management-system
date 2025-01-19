'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import { EventSubcategoryTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function CategoriesPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['sub-category'],
        queryFn: () => fetchData(apiConfig?.GET_EVENT_SUBCATEGORY),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Event Subcategories" />
                <AddButton link="sub-categories/add" />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={EventSubcategoryTableColumn}
            />
        </div>
    );
}
