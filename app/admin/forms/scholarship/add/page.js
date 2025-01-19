import PageTitle from '@/components/admin/common/PageTitle';
import ScholarshipInfoForm from '@/components/admin/form/ScholarshipInfoForm';

export default async function CategoriesPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Create New Scholarship Event" />
            <ScholarshipInfoForm />
        </div>
    );
}
