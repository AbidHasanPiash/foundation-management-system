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
import { handleImageChange } from '@/util/formikHelpers';
import { Textarea } from '@/components/ui/textarea';

export default function MessageForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        title: data?.title || '',
        name: data?.name || '',
        image: '',
        message: data?.message || '',
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
        name: Yup.string().required('Required field'),
        message: Yup.string().required('Required field'),
    });

    const submit = async (values) => {
        const formData = new FormData();
        if (values.image) {
            formData.append('image', values.image);
        }
        formData.append('title', values.title);
        formData.append('name', values.name);
        formData.append('message', values.message);

        if (data) {
            await updateData(apiConfig?.UPDATE_MESSAGE + data?._id, formData);
        } else {
            await postData(apiConfig?.CREATE_MESSAGE, formData);
        }
    };

    const reset = () => {
        formik?.resetForm();
        queryClient.invalidateQueries(['message']);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
        validateOnBlur: true,
        validateOnChange: true,
    });

    const mutation = useMutation({
        mutationKey: ['createBenefitsOfMembers'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-3 gap-2 w-full'>
                <InputWrapper
                    label='Title'
                    error={formik.errors?.title}
                    touched={formik.touched?.title}
                >
                    <Input
                        name='title'
                        placeholder='Title'
                        value={formik.values?.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Name'
                    error={formik.errors?.name}
                    touched={formik.touched?.name}
                >
                    <Input
                        name='name'
                        placeholder='Name'
                        value={formik.values?.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Image'
                    error={formik.errors?.image}
                    touched={formik.touched?.image}
                >
                    <Input
                        type='file'
                        name='image'
                        accept='image/png, image/gif, image/jpeg, image/jpg'
                        onChange={handleImageChange(formik, 'image')}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Message'
                    error={formik.errors?.message}
                    touched={formik.touched?.message}
                    className={'md:col-span-3'}
                >
                    <Textarea
                        name='message'
                        placeholder='Message'
                        value={formik.values?.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
            </div>

            <div className='flex items-center space-x-2'>
                <Reset />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
