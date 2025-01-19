'use client';

import AddButton from '@/components/admin/button/AddButton';
import PageTitle from '@/components/admin/common/PageTitle';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiConfig from '@/configs/apiConfig';
import { fetchData, deleteData } from '@/util/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { HiPencil, HiTrash } from 'react-icons/hi';

export default function CarouselPage() {
    const queryClient = useQueryClient();

    const { isLoading, data } = useQuery({
        queryKey: ['carousel'],
        queryFn: () => fetchData(apiConfig.GET_CAROUSEL),
    });

    const deleteMutation = useMutation({
        mutationKey: ['deleteCarousel'],
        mutationFn: async (id) =>
            await deleteData(apiConfig.DELETE_CAROUSEL, id),
        onSuccess: () => queryClient.invalidateQueries(['carousel']),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Carousel Images" />
                <AddButton link="carousel/add" />
            </div>

            {/* Carousel Items */}
            <div className="grid gap-4">
                {isLoading && <Spinner />}
                {data &&
                    data?.map((item) => (
                        <Card key={item._id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{item?.title}</CardTitle>
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={`carousel/edit/${item?._id}`}
                                        >
                                            <Button
                                                size="icon"
                                                variant="default"
                                            >
                                                <span>
                                                    <HiPencil className="w-4 h-4" />
                                                </span>
                                            </Button>
                                        </Link>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() =>
                                                deleteMutation.mutate(item._id)
                                            }
                                        >
                                            {deleteMutation.isPending ? (
                                                <Spinner size="4" />
                                            ) : (
                                                <HiTrash className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex justify-between mt-2">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                />
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    );
}
