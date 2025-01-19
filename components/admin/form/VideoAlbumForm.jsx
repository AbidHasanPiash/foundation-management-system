'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import { Textarea } from '@/components/ui/textarea';

export default function VideoAlbumForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        link: data?.link || '',
        title: data?.title || '',
        date: data?.date?.split('T')[0] || '',
        description: data?.description || '',
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Required field'),
        link: Yup.string()
            .matches(
                /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                'Must be a valid YouTube link'
            )
            .required('YouTube link is required'),
        date: Yup.date()
            .required('Date is required')
            .max(new Date(), 'Date cannot be in the future'),
        description: Yup.string().required('Required field'),
    });

    const submit = async (values) => {
        if (data) {
            await updateData(apiConfig?.UPDATE_VIDEO + data?._id, values);
        } else {
            await postData(apiConfig?.CREATE_VIDEO, values);
        }
    };

    const reset = () => {
        formik?.resetForm();
        queryClient.invalidateQueries(['video']);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
        validateOnBlur: true,
        validateOnChange: true,
    });

    const mutation = useMutation({
        mutationKey: ['create-video'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-2 gap-2 w-full'>
                <InputWrapper
                    label='Youtube video link'
                    error={formik.errors?.link}
                    touched={formik.touched?.link}
                >
                    <Input
                        name='link'
                        placeholder='Youtube video link'
                        value={formik.values?.link}
                        onChange={formik.handleChange}
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

            <div className='flex items-center space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
