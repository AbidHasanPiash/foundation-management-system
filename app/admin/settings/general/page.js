'use client';

import PageTitle from '@/components/admin/common/PageTitle';
import OrganizationInfoForm from '@/components/admin/form/OrganizationInfoForm';
import Spinner from '@/components/common/Spinner';
import apiConfig from '@/configs/apiConfig';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function SettingsPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['generalInfo'],
        queryFn: async () => {
            const response = await fetchData(apiConfig?.GET_GENERAL_INFO);
            // Normalize response to ensure data is always an array
            return Array.isArray(response) ? response[0] : response;
        },
    });

    return isLoading ? (
        <Spinner />
    ) : (
        <div>
            <PageTitle title="Organization Information" />
            <OrganizationInfoForm data={data} />
        </div>
    );
}
