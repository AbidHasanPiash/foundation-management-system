import PageTitle from '@/components/admin/common/PageTitle';
import apiConfig from '@/configs/apiConfig';
import getSpecificApiData from '@/util/getSpecificApiData';
import React from 'react';
import Events from './events';

export default async function EventListPage({ params }) {
    const { category, subcategory } = params;

    const categoryData = await getSpecificApiData(
        apiConfig?.GET_EVENT_CATEGORY_BY_ID + category,
        ['isSpecial', 'category']
    );
    const subcategoryData = await getSpecificApiData(
        apiConfig?.GET_EVENT_SUBCATEGORY_BY_ID + subcategory,
        ['subCategory']
    );
    return (
        <div className="space-y-4">
            <PageTitle
                title="Event:"
                description={`${categoryData?.category}/ ${subcategoryData?.subCategory}`}
                back={false}
            />
            <Events category={category} subCategory={subcategory} />
        </div>
    );
}
