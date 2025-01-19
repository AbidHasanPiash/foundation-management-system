import PageTitle from '@/components/admin/common/PageTitle';
import EventForm from '@/components/admin/form/EventForm';
import apiConfig from '@/configs/apiConfig';
import getSpecificApiData from '@/util/getSpecificApiData';

export default async function AddEventPage({ params }) {
    const { category, subCategory } = params;

    const categoryData = await getSpecificApiData(
        apiConfig?.GET_EVENT_CATEGORY_BY_ID + category,
        ['isSpecial', 'category']
    );
    const subcategoryData = await getSpecificApiData(
        apiConfig?.GET_EVENT_SUBCATEGORY_BY_ID + subCategory,
        ['subCategory']
    );
    return (
        <div className="space-y-4">
            <PageTitle
                title={
                    categoryData?.isSpecial
                        ? 'Create a special event for'
                        : 'Create new event for:'
                }
                description={`${categoryData?.category}/ ${subcategoryData?.subCategory}`}
            />

            <EventForm
                category={category}
                subCategory={subCategory}
                isSpacialCategory={categoryData?.isSpecial}
            />
        </div>
    );
}
