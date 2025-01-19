import NoDataFound from '@/components/admin/common/NoDataFound';
import VideoCard from '@/components/card/VideoCard';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function VideoGalleryPage() {
    const data = await fetchDataAsServer(apiConfig?.GET_VIDEO);

    return !data ? (
        <NoDataFound />
    ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (
                <VideoCard key={item?._id} item={item} />
            ))}
        </div>
    );
}
