import AddButton from '@/components/admin/button/AddButton';
import PageTitle from '@/components/admin/common/PageTitle';
import apiConfig from '@/configs/apiConfig';
import getSpecificApiData from '@/util/getSpecificApiData';
import Events from './events';
import { fetchDataAsServer } from '@/util/axios';

export default async function EventsPage({ params }) {
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
            <div className="flex justify-between items-center">
                <PageTitle
                    title="Event:"
                    description={`${categoryData?.category}/ ${
                        subcategoryData?.subCategory
                    }`}
                />
                <AddButton link={`${subCategory}/add`} />
            </div>

            <Events category={category} subCategory={subCategory} />
        </div>
    );
}

export async function generateStaticParams() {
    const data = await fetchDataAsServer(apiConfig?.GET_EVENT_SUBCATEGORY);

    // Check if data is an array, return an empty array if not
    if (!Array.isArray(data)) {
        return [];
    }

    return data.map((event) => ({
        category: event.category,
        subCategory: event._id,
    }));
}
