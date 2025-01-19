import PageTitle from '@/components/admin/common/PageTitle';
import VideoAlbumForm from '@/components/admin/form/VideoAlbumForm';
import React from 'react';

export default function PhotoAlbumAddPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Add new photo" />
            <VideoAlbumForm />
        </div>
    );
}
