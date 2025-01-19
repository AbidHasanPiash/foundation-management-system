'use client';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import { NewsAlbumTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function PhotoAlbumsPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['current-news'],
        queryFn: () => fetchData(apiConfig?.GET_NEWS),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Current News" />
                <AddButton link="current-news/add" />
            </div>

            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={NewsAlbumTableColumn}
            />
        </div>
    );
}
