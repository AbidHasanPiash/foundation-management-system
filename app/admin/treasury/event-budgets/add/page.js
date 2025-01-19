import PageTitle from '@/components/admin/common/PageTitle';
import EventBudgetForm from '@/components/admin/form/EventBudgetForm';
import React from 'react';

export default function AddDonationPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Manage Event Budget" />
            <EventBudgetForm />
        </div>
    );
}
