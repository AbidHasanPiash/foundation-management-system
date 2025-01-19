import apiConfig from '@/configs/apiConfig';
import EventCard from '@/components/card/EventCard';
import NoDataFound from '@/components/admin/common/NoDataFound';
import { fetchDataAsServer } from '@/util/axios';

export default async function Events({ category, subCategory }) {
    const data = await fetchDataAsServer(
        `${apiConfig?.GET_EVENT}?subcategoryId=${subCategory}&categoryId=${category}`
    );

    return !data ? (
        <NoDataFound />
    ) : (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {data &&
                data.map((event, index) => (
                    <EventCard key={index} event={event} />
                ))}
        </div>
    );
}
