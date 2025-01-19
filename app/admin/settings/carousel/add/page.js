import PageTitle from '@/components/admin/common/PageTitle';
import CarouselForm from '@/components/admin/form/CarouselForm';

export default async function CategoriesPage() {
    return (
        <div className="space-y-4">
            <PageTitle title="Add New Carousel Image" />
            <CarouselForm />
        </div>
    );
}
