import PageTitle from '@/components/admin/common/PageTitle';
import MessageForm from '@/components/admin/form/MessageForm';

export default async function CategoriesPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Create New Message" />
            <MessageForm />
        </div>
    );
}
