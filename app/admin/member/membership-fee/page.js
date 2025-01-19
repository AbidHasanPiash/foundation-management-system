'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import Spinner from '@/components/common/Spinner';
import AboutForm from '@/components/form/AboutForm';
import apiConfig from '@/configs/apiConfig';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function AboutMembershipFeePage() {
    const { isLoading, data, isRefetching, refetch } = useQuery({
        queryKey: ['aboutMembershipFee'],
        queryFn: () => fetchData(apiConfig?.GET_MEMBERSHIP_FEE),
    });

    const updateAPI = apiConfig?.MEMBERSHIP_FEE;
    const createAPI = apiConfig?.MEMBERSHIP_FEE;

    return isLoading || isRefetching ? (
        <Spinner />
    ) : (
        <div>
            <PageTitle title="About Membership Fee" />
            <AboutForm
                data={data}
                refetch={refetch}
                updateAPI={updateAPI}
                createAPI={createAPI}
            />
        </div>
    );
}
