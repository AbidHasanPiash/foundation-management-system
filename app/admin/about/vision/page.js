'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import Spinner from '@/components/common/Spinner';
import AboutForm from '@/components/form/AboutForm';
import apiConfig from '@/configs/apiConfig';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function AboutVisionPage() {
    const { isLoading, data, isRefetching, refetch } = useQuery({
        queryKey: ['vision'],
        queryFn: () => fetchData(apiConfig?.GET_ABOUT_VISION),
    });

    const updateAPI = apiConfig?.ABOUT_VISION;
    const createAPI = apiConfig?.ABOUT_VISION;

    return isLoading || isRefetching ? (
        <Spinner />
    ) : (
        <div>
            <PageTitle title="About Vision" />
            <AboutForm
                data={data}
                refetch={refetch}
                updateAPI={updateAPI}
                createAPI={createAPI}
            />
        </div>
    );
}
