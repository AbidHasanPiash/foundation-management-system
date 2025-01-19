'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import { PaymentMethodTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function PaymentMethodPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['payment-method'],
        queryFn: () => fetchData(apiConfig?.GET_PAYMENT_METHOD),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Payment Method" />
                <AddButton link="payment-method/add" />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={PaymentMethodTableColumn}
            />
        </div>
    );
}
