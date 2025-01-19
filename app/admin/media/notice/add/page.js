import PageTitle from '@/components/admin/common/PageTitle';
import NoticeForm from '@/components/admin/form/NoticeForm';
import React from 'react';

export default function PhotoAlbumAddPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Add Current News" />
            <NoticeForm />
        </div>
    );
}
