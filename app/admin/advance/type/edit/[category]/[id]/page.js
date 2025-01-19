import NoDataFound from '@/components/admin/common/NoDataFound';
import PageTitle from '@/components/admin/common/PageTitle';
import AdvanceTypeForm from '@/components/admin/form/AdvanceTypeForm';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function EditStatusPage({ params }) {
    const { category, id } = params;
    const data = await fetchDataAsServer(
        `${apiConfig?.GET_TYPE_BY_ID}${category}/${id}`
    );

    return (
        <div className="space-y-4">
            <PageTitle title={`Edit Status`} />
            {data ? <AdvanceTypeForm data={data} /> : <NoDataFound />}
        </div>
    );
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const data = await fetchDataAsServer(apiConfig?.GET_ALL_TYPE);
    return Array.isArray(data)
        ? data?.map((item) => ({
              category: encodeURIComponent(item.category),
              id: encodeURIComponent(item._id),
          }))
        : [];
}
