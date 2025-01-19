import PageTitle from '@/components/admin/common/PageTitle';
import EligibleInstituteForm from '@/components/admin/form/EligibleInstituteForm';

export default async function EligibleInstituteAddPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Create New Eligible Institute" />
            <EligibleInstituteForm />
        </div>
    );
}
