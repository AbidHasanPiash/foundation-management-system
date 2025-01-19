import CarouselHero from '@/components/module/CarouselHero';
import MemberCount from '@/components/module/MemberCount';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function Hero() {
    const carousel = await fetchDataAsServer(apiConfig?.GET_CAROUSEL);
    const memberCount = await fetchDataAsServer(apiConfig?.GET_MEMBER_COUNT);
    return (
        <section className='w-full h-[120vh]'>
            <div className='w-full h-2/3 sp'>
                <CarouselHero carousel={carousel} />
            </div>
            <div className='w-full h-1/3 pt-8'>
                <MemberCount memberCount={memberCount} />
            </div>
        </section>
    );
}
