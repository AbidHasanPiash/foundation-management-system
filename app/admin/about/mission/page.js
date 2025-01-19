'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import Spinner from '@/components/common/Spinner';
import AboutForm from '@/components/form/AboutForm';
import apiConfig from '@/configs/apiConfig';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function AboutMissionPage() {
    const { isLoading, data, isRefetching, refetch } = useQuery({
        queryKey: ['mission'],
        queryFn: () => fetchData(apiConfig?.GET_ABOUT_MISSION),
    });

    const updateAPI = apiConfig?.ABOUT_MISSION;
    const createAPI = apiConfig?.ABOUT_MISSION;

    return isLoading || isRefetching ? (
        <Spinner />
    ) : (
        <div>
            <PageTitle title="About Mission" />
            <AboutForm
                data={data}
                refetch={refetch}
                updateAPI={updateAPI}
                createAPI={createAPI}
            />
        </div>
    );
}
