'use client';
import React from 'react';
import apiConfig from '@/configs/apiConfig';
import DefaultTable from '@/components/admin/table/DefaultTable';
import PageTitle from '@/components/admin/common/PageTitle';
import AddButton from '@/components/admin/button/AddButton';
import { DonationTableColumn } from '@/components/admin/table/DefaultColumns';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/components/common/Spinner';

export default function DonationPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['donation'],
        queryFn: () => fetchData(apiConfig?.GET_DONATION),
    });
    const { isLoading: treasuryLoading, data: treasury } = useQuery({
        queryKey: ['treasury'],
        queryFn: () => fetchData(apiConfig?.GET_TREASURY_INFO),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Donations" />
                <AddButton title="Add Donation" link="donations/add" />
            </div>

            {/* Header Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DonationCard
                    loading={treasuryLoading}
                    title="Current Amount"
                    value={treasury?.currentBalance}
                />
                <DonationCard
                    loading={treasuryLoading}
                    title="Last Month"
                    value={treasury?.lastMonthBalance}
                />
                <DonationCard
                    loading={treasuryLoading}
                    title="Recent Donation"
                    value={treasury?.lastDonation?.amount}
                />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={DonationTableColumn}
            />
        </div>
    );
}

export function DonationCard({ loading, title, value, className }) {
    return (
        <Card className={`bg-muted/10 ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="text-2xl font-semibold">
                    {loading ? (
                        <Spinner size="4" />
                    ) : (
                        <span>&#2547; {value}</span>
                    )}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
