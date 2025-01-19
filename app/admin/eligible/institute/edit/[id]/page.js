import NoDataFound from '@/components/admin/common/NoDataFound';
import PageTitle from '@/components/admin/common/PageTitle';
import EligibleInstituteForm from '@/components/admin/form/EligibleInstituteForm';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function EligibleInstituteEditPage({ params }) {
    const { id } = params;
    const data = await fetchDataAsServer(
        apiConfig?.GET_ELIGIBLE_INSTITUTE_BY_ID + id
    );

    return (
        <div className="space-y-4">
            <PageTitle title="Edit Eligible Institute" />
            {data ? <EligibleInstituteForm data={data} /> : <NoDataFound />}
        </div>
    );
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const data = await fetchDataAsServer(apiConfig?.GET_ELIGIBLE_INSTITUTE);
    return Array.isArray(data)
        ? data?.map((item) => ({
              id: encodeURIComponent(item._id),
          }))
        : [];
}
