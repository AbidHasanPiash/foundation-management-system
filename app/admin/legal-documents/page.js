'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import Spinner from '@/components/common/Spinner';
import LegalDocumentsForm from '@/components/form/LegalDocumentsForm';
import apiConfig from '@/configs/apiConfig';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function LegalDocumentsPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['legalDocument'],
        queryFn: () => fetchData(apiConfig?.GET_LEGAL_DOCUMENT),
    });

    const updateAPI = apiConfig?.LEGAL_DOCUMENT;
    const createAPI = apiConfig?.LEGAL_DOCUMENT;

    return isLoading ? (
        <Spinner />
    ) : (
        <div>
            <PageTitle title="Legal Documents" />
            {data && (
                <LegalDocumentsForm
                    data={data}
                    updateAPI={updateAPI}
                    createAPI={createAPI}
                />
            )}
        </div>
    );
}
