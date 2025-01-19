import PageTitle from '@/components/admin/common/PageTitle';
import DonationForm from '@/components/admin/form/DonationForm';
import React from 'react';

export default function AddDonationPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Add Donation" />
            <DonationForm />
        </div>
    );
}
