import NewsCard from '@/components/card/NewsCard';
import PhotoCard from '@/components/card/PhotoCard';
import VideoCard from '@/components/card/VideoCard';
import SectionTitle from '@/components/common/SectionTitle';
import NoDataFound from '@/components/admin/common/NoDataFound';
import apiConfig from '@/configs/apiConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchDataAsServer } from '@/util/axios';
import { InvertButton } from '@/components/common/Buttons';
import Link from 'next/link';

export default function Media() {
    return (
        <section className='sp pb-20'>
            <div className='max-w-7xl mx-auto'>
                <Tabs defaultValue='news' className='w-full'>
                    <div className='flex flex-col md:flex-row items-center justify-between'>
                        <SectionTitle title={'Media Gallery'} />
                        <TabsList>
                            <TabsTrigger value='news'>News Room</TabsTrigger>
                            <TabsTrigger value='photo'>
                                Photo Gallery
                            </TabsTrigger>
                            <TabsTrigger value='video'>
                                Video Gallery
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value='news'>
                        {' '}
                        <NewsGrid />{' '}
                    </TabsContent>
                    <TabsContent value='photo'>
                        {' '}
                        <PhotoGrid />{' '}
                    </TabsContent>
                    <TabsContent value='video'>
                        {' '}
                        <VideoGrid />{' '}
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}

async function NewsGrid() {
    const news = await fetchDataAsServer(apiConfig?.GET_NEWS);
    return !news ? (
        <NoDataFound />
    ) : (
        <div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4'>
                {news.slice(0, 4).map((item) => (
                    <NewsCard key={item?._id} item={item} />
                ))}
            </div>
            <div className='w-full flex items-center justify-center'>
                <Link href={'/notice'}>
                    <InvertButton title='View More News' />{' '}
                </Link>
            </div>
        </div>
    );
}

async function PhotoGrid() {
    const photo = await fetchDataAsServer(apiConfig?.GET_PHOTO);
    return !photo ? (
        <NoDataFound />
    ) : (
        <div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4'>
                {photo.slice(0, 4).map(
                    (
                        item //slice the photo array to show only 4 photos
                    ) => (
                        <PhotoCard key={item?._id} item={item} />
                    )
                )}
            </div>
            <div className='w-full flex items-center justify-center'>
                <Link href={'/notice'}>
                    <InvertButton title='View More Photos' />{' '}
                </Link>
            </div>
        </div>
    );
}

async function VideoGrid() {
    const video = await fetchDataAsServer(apiConfig?.GET_VIDEO);
    return !video ? (
        <NoDataFound />
    ) : (
        <div>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
                {video.slice(0, 3).map((item) => (
                    <VideoCard key={item?._id} item={item} />
                ))}
            </div>
            <div className='w-full flex items-center justify-center'>
                <Link href={'/notice'}>
                    <InvertButton title='View More Videos' />{' '}
                </Link>
            </div>
        </div>
    );
}
