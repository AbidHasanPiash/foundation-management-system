import PageTitle from '@/components/admin/common/PageTitle';
import EventSubcategoryForm from '@/components/admin/form/EventSubcategoryForm';

export default async function CategoriesPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Create New Event Category" />
            <EventSubcategoryForm />
        </div>
    );
}
