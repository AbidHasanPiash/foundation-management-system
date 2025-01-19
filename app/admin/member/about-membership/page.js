'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import Spinner from '@/components/common/Spinner';
import AboutForm from '@/components/form/AboutForm';
import apiConfig from '@/configs/apiConfig';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function AboutMembershipPage() {
    const { isLoading, data, isRefetching, refetch } = useQuery({
        queryKey: ['aboutMembership'],
        queryFn: () => fetchData(apiConfig?.GET_ABOUT_MEMBERSHIP),
    });

    const updateAPI = apiConfig?.ABOUT_MEMBERSHIP;
    const createAPI = apiConfig?.ABOUT_MEMBERSHIP;

    return isLoading || isRefetching ? (
        <Spinner />
    ) : (
        <div>
            <PageTitle title="About Membership" />
            <AboutForm
                data={data}
                refetch={refetch}
                updateAPI={updateAPI}
                createAPI={createAPI}
            />
        </div>
    );
}
