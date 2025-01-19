import PageTitle from '@/components/admin/common/PageTitle';
import TeamForm from '@/components/admin/form/TeamForm';
import React from 'react';

export default function CommitteeAddPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Create new team member" />
            <TeamForm />
        </div>
    );
}
