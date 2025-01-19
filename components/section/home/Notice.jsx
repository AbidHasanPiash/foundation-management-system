import React from 'react';
import Link from 'next/link';
import SectionTitle from '@/components/common/SectionTitle';
import { InvertButton } from '@/components/common/Buttons';
import NoticeCard from '@/components/common/NoticeCard';
import { fetchDataAsServer } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import NoDataFound from '@/components/admin/common/NoDataFound';
import LinkGradient from '@/components/common/LinkGradient';

export default async function Notice() {
    const notice = await fetchDataAsServer(apiConfig?.GET_NOTICE);
    const scholarshipForm = await fetchDataAsServer(
        `${apiConfig?.GET_SCHOLARSHIP_FORM}?isActive=true`
    );

    return (
        <section className='sp'>
            <div className='max-w-7xl mx-auto'>
                <SectionTitle title={'Notice'} />
                <div className='grid gap-4 md:grid-cols-3'>
                    <div className='md:col-span-2'>
                        <div className='grid gap-2 md:gap-4 mb-4'>
                            {!notice ? (
                                <NoDataFound />
                            ) : (
                                notice?.map((item) => (
                                    <NoticeCard key={item?._id} item={item} />
                                ))
                            )}
                        </div>
                        <div className='w-full flex items-center justify-center'>
                            <Link href={'/notice'}>
                                <InvertButton title='View All' />{' '}
                            </Link>
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <div className='grid gap-2 mb-2'>
                            {scholarshipForm &&
                                scholarshipForm?.map((link, index) => (
                                    <LinkGradient
                                        key={index}
                                        index={index}
                                        href={`/application/${link?._id}`}
                                        title={link?.formTitle}
                                        description={new Date(link?.lastDate).toLocaleDateString()}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
