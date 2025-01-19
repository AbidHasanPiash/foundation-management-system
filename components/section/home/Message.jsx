import SectionTitle from '@/components/common/SectionTitle';
import React from 'react';

export default function Message() {
    const data = {
        title: 'Message from Secretary General',
        name: 'Alin Boby',
        img: '/carousel/carousel (2).jpg',
        message:
            'As we navigate the dynamic landscape of technology, it is crucial that we, as members of the Bangladesh Computer Society, unite our efforts to achieve our shared goals and amplify',
    };
    return (
        <section className='sp'>
            <div className='max-w-7xl mx-auto'>
                <SectionTitle title={'Message'} />
                <div className='flex flex-col md:flex-row items-center justify-between gap-10'>
                    <img
                        src={data?.img}
                        alt={`${data?.title}'s image`}
                        className='w-52 h-60 object-cover rounded-md'
                    />
                    <div className='space-y-10'>
                        <p className='text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-satisfy text-secondary text- w-full'>
                            {data?.title}
                        </p>
                        <p className='text-justify'>{data?.message}</p>
                        <p className='text-end font-satisfy tracking-widest text-lg'>
                            {' '}
                            — {data?.name}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
