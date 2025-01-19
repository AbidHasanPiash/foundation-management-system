import PageTitle from '@/components/admin/common/PageTitle';
import BenefitForm from '@/components/admin/form/BenefitForm';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function CategoryEditPage({ params }) {
    const { id } = params;
    const data = await fetchDataAsServer(
        apiConfig?.GET_BENEFITS_OF_MEMBERS_BY_ID + id
    );

    return (
        <div className="space-y-4">
            <PageTitle title="Edit benefit" />
            <BenefitForm data={data} />
        </div>
    );
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const data = await fetchDataAsServer(apiConfig?.GET_BENEFITS_OF_MEMBERS);
    return Array.isArray(data)
        ? data?.map((item) => ({
              id: encodeURIComponent(item._id),
          }))
        : [];
}
