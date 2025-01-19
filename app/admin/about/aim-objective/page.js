'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import Spinner from '@/components/common/Spinner';
import AboutForm from '@/components/form/AboutForm';
import apiConfig from '@/configs/apiConfig';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function AboutAimObjectivePage() {
    const { isLoading, data, isRefetching, refetch } = useQuery({
        queryKey: ['aim'],
        queryFn: () => fetchData(apiConfig?.GET_ABOUT_AIM_OBJECTIVE),
    });

    const updateAPI = apiConfig?.ABOUT_AIM_OBJECTIVE;
    const createAPI = apiConfig?.ABOUT_AIM_OBJECTIVE;

    return isLoading || isRefetching ? (
        <Spinner />
    ) : (
        <div>
            <PageTitle title="About Aim and Objective" />
            <AboutForm
                data={data}
                refetch={refetch}
                updateAPI={updateAPI}
                createAPI={createAPI}
            />
        </div>
    );
}
