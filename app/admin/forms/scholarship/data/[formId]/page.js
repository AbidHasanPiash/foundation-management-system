import DataTable from './DataTable';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function ScholarshipFormDataPage({ params }) {
    const { formId } = params;

    return <DataTable formId={formId} />;
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const data = await fetchDataAsServer(apiConfig?.GET_SCHOLARSHIP_FORM);
    return Array.isArray(data)
        ? data?.map((item) => ({
            formId: encodeURIComponent(item._id),
        }))
        : [];
}
