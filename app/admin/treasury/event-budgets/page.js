'use client';
import AddButton from '@/components/admin/button/AddButton';
import PageTitle from '@/components/admin/common/PageTitle';
import { EventBudgetTableColumn } from '@/components/admin/table/DefaultColumns';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export default function EventBudgetPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['event-budget'],
        queryFn: () => fetchData(apiConfig?.GET_BUDGET),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Event Budget" />
                <AddButton title="New Budget" link="event-budgets/add" />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={EventBudgetTableColumn}
            />
        </div>
    );
}
