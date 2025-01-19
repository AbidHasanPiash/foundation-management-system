import NoDataFound from '@/components/admin/common/NoDataFound';
import PageTitle from '@/components/admin/common/PageTitle';
import MembershipForm from '@/components/form/MembershipForm';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function CategoryEditPage({ params }) {
    const { id } = params;
    const data = await fetchDataAsServer(apiConfig?.GET_MEMBER_BY_ID + id);

    return (
        <div className="space-y-4">
            <PageTitle title="Edit member" />
            {data ? <MembershipForm data={data} /> : <NoDataFound />}
        </div>
    );
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const data = await fetchDataAsServer(apiConfig?.GET_MEMBER_LIST);
    return Array.isArray(data)
        ? data?.map((item) => ({
              id: encodeURIComponent(item._id),
          }))
        : [];
}
