import PageTitle from '@/components/admin/common/PageTitle';
import PhotoAlbumForm from '@/components/admin/form/PhotoAlbumForm';
import React from 'react';

export default function PhotoAlbumAddPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Add new photo" />
            <PhotoAlbumForm />
        </div>
    );
}
