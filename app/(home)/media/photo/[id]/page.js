import NoDataFound from '@/components/admin/common/NoDataFound';
import ImagePreviewer from '@/components/common/ImagePreviewer';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function PhotoViewerPage({ params }) {
    const { id } = params;
    const data = await fetchDataAsServer(apiConfig?.GET_PHOTO_BY_ID + id);

    return !data ? (
        <NoDataFound />
    ) : (
        <div className="w-full h-full space-y-10">
            {/* Title and Description Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        {data.title}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {new Date(data.date).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-base text-gray-800">
                    {data.description}
                </div>
            </div>

            {/* Image Section with ImagePreviewer Component */}
            <div className="w-full h-auto border border-secondary rounded-2xl flex items-center justify-center">
                <ImagePreviewer
                    src={data.image}
                    alt={data.title}
                    className="object-contain"
                />
            </div>
        </div>
    );
}
