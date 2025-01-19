import PageTitle from '@/components/admin/common/PageTitle';
import CurrentNewsForm from '@/components/admin/form/CurrentNewsForm';
import React from 'react';

export default function PhotoAlbumAddPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Add Current News" />
            <CurrentNewsForm />
        </div>
    );
}
