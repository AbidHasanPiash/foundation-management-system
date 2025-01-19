import PageTitle from '@/components/admin/common/PageTitle';
import PaymentMethodForm from '@/components/admin/form/PaymentMethodForm';

export default async function CategoriesPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Create New Message" />
            <PaymentMethodForm />
        </div>
    );
}
