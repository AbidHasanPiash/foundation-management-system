import NoDataFound from '@/components/admin/common/NoDataFound';
import NoticeCard from '@/components/common/NoticeCard';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function NoticePage() {
    const data = await fetchDataAsServer(apiConfig?.GET_NOTICE);

    return !data ? (
        <NoDataFound />
    ) : (
        <div className="grid gap-4">
            {data.map((item) => (
                <NoticeCard key={item?._id} item={item} />
            ))}
        </div>
    );
}
