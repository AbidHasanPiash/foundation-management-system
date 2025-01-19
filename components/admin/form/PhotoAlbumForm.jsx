'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { clearField, handleImageChange } from '@/util/formikHelpers';
import { postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { GoX } from 'react-icons/go';

export default function PhotoAlbumForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        image: '',
        title: data?.title || '',
        date: data?.date?.split('T')[0] || '',
        description: data?.description || '',
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Required field'),
        image: Yup.mixed()
            .required('Image is required')
            .test(
                'fileSize',
                'File size too large',
                (value) => !value || (value && value.size <= 2000000)
            ) // 2MB limit
            .test(
                'fileType',
                'Unsupported file format',
                (value) =>
                    !value ||
                    [
                        'image/png',
                        'image/jpeg',
                        'image/jpg',
                        'image/gif',
                    ].includes(value.type)
            ),
        date: Yup.date()
            .required('Date is required')
            .max(new Date(), 'Date cannot be in the future'),
        description: Yup.string().required('Required field'),
    });

    const submit = async (values) => {
        const formData = new FormData();

        formData.append('title', values.title);
        formData.append('image', values.image);
        formData.append('date', values.date);
        formData.append('description', values.description);

        if (data) {
            await updateData(apiConfig?.UPDATE_PHOTO + data?._id, formData);
        } else {
            await postData(apiConfig?.CREATE_PHOTO, formData);
        }
    };

    const reset = () => {
        formik?.resetForm();
        queryClient.invalidateQueries(['photo']);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
        validateOnBlur: true,
        validateOnChange: true,
    });

    const mutation = useMutation({
        mutationKey: ['photo'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div>
                <div
                    className={`gap-2 ${data?.image && 'grid md:grid-cols-2'}`}
                >
                    <div
                        className={`gap-2 ${!data?.image && 'grid md:grid-cols-2'}`}
                    >
                        <InputWrapper
                            label='Profile Image'
                            error={formik.errors?.image}
                            touched={formik.touched?.image}
                        >
                            <Input
                                type='file'
                                name='image'
                                accept='image/png, image/gif, image/jpeg, image/jpg, image/jpg'
                                onChange={handleImageChange(formik, 'image')}
                                onBlur={formik.handleBlur}
                            />
                        </InputWrapper>

                        <InputWrapper
                            label='Date'
                            error={formik.errors?.date}
                            touched={formik.touched?.date}
                        >
                            <Input
                                type='date'
                                name='date'
                                value={formik.values?.date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </InputWrapper>
                    </div>
                    {data?.image && (
                        <div className='flex items-center justify-end relative'>
                            <img
                                src={data?.image}
                                alt='Selected Image'
                                className='w-24 h-24 object-cover border border-dashed rounded-md p-1'
                            />
                            <Button
                                type='button'
                                size='icon'
                                onClick={() => clearField(formik, 'image')}
                                className='absolute -top-1 -right-1 w-6 h-6 bg-rose-500 hover:bg-rose-600 rounded-full'
                            >
                                <GoX />
                            </Button>
                        </div>
                    )}
                </div>
                <div className='grid md:grid-cols-2 gap-2 w-full'>
                    <InputWrapper
                        label='Title'
                        error={formik.errors?.title}
                        touched={formik.touched?.title}
                        className={'md:col-span-2'}
                    >
                        <Input
                            name='title'
                            placeholder='Photo Title'
                            value={formik.values?.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label='Description'
                        error={formik.errors?.description}
                        touched={formik.touched?.description}
                        className={'md:col-span-2'}
                    >
                        <Textarea
                            name='description'
                            placeholder='Description'
                            value={formik.values?.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>
                </div>
            </div>

            <div className='flex items-center space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
