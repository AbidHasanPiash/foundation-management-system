import PageTitle from '@/components/admin/common/PageTitle';
import EventCategoryForm from '@/components/admin/form/EventCategoryForm';

export default async function CategoriesPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Create New Event Category" />
            <EventCategoryForm />
        </div>
    );
}
