import PageTitle from '@/components/admin/common/PageTitle';
import AdvanceTypeForm from '@/components/admin/form/AdvanceTypeForm';

export default function CreateStatusPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Create New Status" />
            <AdvanceTypeForm />
        </div>
    );
}
