import NoDataFound from '@/components/admin/common/NoDataFound';
import NewsCard from '@/components/card/NewsCard';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function CurrentNewsPage() {
    const data = await fetchDataAsServer(apiConfig?.GET_NEWS);

    return !data ? (
        <NoDataFound />
    ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((item) => (
                <NewsCard key={item?._id} item={item} />
            ))}
        </div>
    );
}
