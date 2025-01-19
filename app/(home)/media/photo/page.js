import NoDataFound from '@/components/admin/common/NoDataFound';
import PhotoCard from '@/components/card/PhotoCard';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function PhotoGalleryPage() {
    const transformData = (data) => {
        // Group data by year
        const groupedByYear = data.reduce((acc, item) => {
            const year = new Date(item.date).getFullYear(); // Extract year from the date
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push({
                id: item._id, // Use _id as id
                title: item.title,
                description: item.description,
                date: new Date(item.date).toISOString().split('T')[0], // Format date as YYYY/MM/DD
                image: item.image, // Use image for img
            });
            return acc;
        }, {});

        // Convert grouped data into the desired structure
        return Object.keys(groupedByYear).map((year) => ({
            year: parseInt(year, 10),
            images: groupedByYear[year],
        }));
    };

    const data = await fetchDataAsServer(apiConfig?.GET_PHOTO);

    const photos = transformData(data);
    console.log(JSON.stringify(photos, null, 2));

    return !photos ? (
        <NoDataFound />
    ) : (
        <div>
            {photos.map((section) => (
                <div key={section.year} className="mb-8">
                    <h2 className="text-xl font-bold mb-4">{section.year}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {section.images.map((item) => (
                            <PhotoCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
