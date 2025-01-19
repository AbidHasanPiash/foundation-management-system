import PageTitle from '@/components/admin/common/PageTitle';
import AdvanceStatusForm from '@/components/admin/form/AdvanceStatusForm';

export default function CreateStatusPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Create New Status" />
            <AdvanceStatusForm />
        </div>
    );
}
