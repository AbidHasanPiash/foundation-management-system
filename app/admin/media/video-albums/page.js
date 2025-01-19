'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import { VideoAlbumTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function PhotoAlbumsPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['video'],
        queryFn: () => fetchData(apiConfig?.GET_VIDEO),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Video Albums" />
                <AddButton link="video-albums/add" />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={VideoAlbumTableColumn}
            />
        </div>
    );
}
