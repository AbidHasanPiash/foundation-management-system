import NoDataFound from '@/components/admin/common/NoDataFound';
import PageTitle from '@/components/admin/common/PageTitle';
import EventForm from '@/components/admin/form/EventForm';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';
import getSpecificApiData from '@/util/getSpecificApiData';

export default async function CategoryEditPage({ params }) {
    const { id, category, subCategory } = params;

    const categoryData = await getSpecificApiData(
        apiConfig?.GET_EVENT_CATEGORY_BY_ID + category,
        ['isSpecial', 'category']
    );
    const subcategoryData = await getSpecificApiData(
        apiConfig?.GET_EVENT_SUBCATEGORY_BY_ID + subCategory,
        ['subCategory']
    );

    const data = await fetchDataAsServer(apiConfig?.GET_EVENT_BY_ID + id);

    return (
        <div className="space-y-4">
            <PageTitle
                title={
                    categoryData?.isSpecial
                        ? 'Edit special event for'
                        : 'Edit new event for:'
                }
                description={`${categoryData?.category}/ ${subcategoryData?.subCategory}`}
            />
            {data ? (
                <EventForm
                    data={data}
                    category={category}
                    subCategory={subCategory}
                    isSpacialCategory={categoryData?.isSpecial}
                />
            ) : (
                <NoDataFound />
            )}
        </div>
    );
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const data = await fetchDataAsServer(apiConfig?.GET_EVENT);
    return Array.isArray(data)
        ? data?.map((item) => ({
              id: encodeURIComponent(item._id),
          }))
        : [];
}
