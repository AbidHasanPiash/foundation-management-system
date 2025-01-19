import apiConfig from '@/configs/apiConfig';
import CoverAbout from '@/components/common/CoverAbout';
import NoDataFound from '@/components/admin/common/NoDataFound';
import { fetchDataAsServer } from '@/util/axios';

export default async function AboutMembership() {
    const data = await fetchDataAsServer(apiConfig?.GET_ABOUT_MEMBERSHIP);
    return !data ? (
        <NoDataFound />
    ) : (
        <div className="space-y-10">
            <CoverAbout data={data} />
            <div className="md:text-base sun-editor-content text-foreground w-full overflow-x-auto">
                {/* Rendering HTML content from description */}
                <div dangerouslySetInnerHTML={{ __html: data?.description }} />
            </div>
        </div>
    );
}
