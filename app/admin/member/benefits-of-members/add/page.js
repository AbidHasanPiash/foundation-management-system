import PageTitle from '@/components/admin/common/PageTitle';
import BenefitForm from '@/components/admin/form/BenefitForm';
import React from 'react';

export default function MemberAddPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Create new benefit" />
            <BenefitForm />
        </div>
    );
}
