import PageTitle from '@/components/admin/common/PageTitle';
import MembershipForm from '@/components/form/MembershipForm';
import React from 'react';

export default function MemberAddPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Create new member" />
            <MembershipForm />
        </div>
    );
}
