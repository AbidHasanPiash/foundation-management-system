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
import { getChangedValues } from '@/util/getChangedValues';
import { toast } from 'sonner';

export default function CarouselForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        title: data?.title || '',
        image: '',
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Required field'),
        image: Yup.lazy((value, { parent }) => {
            if (parent?.image || data?.image) {
                // If there's already a banner, no validation is needed
                return Yup.mixed();
            } else {
                // Validate banner as required and check file type
                return Yup.mixed()
                    .required('Image is required')
                    .test(
                        'fileSize',
                        'File size too large',
                        (value) => !value || (value && value.size <= 2000000)
                    )
                    .test(
                        'fileType',
                        'Unsupported file format. Only images are allowed',
                        (value) =>
                            !value ||
                            [
                                'image/jpeg',
                                'image/jpg',
                                'image/png',
                                'image/gif',
                            ].includes(value?.type)
                    );
            }
        }),
    });

    const submit = async (values) => {
        const changedValues = getChangedValues(initialValues, values);

        if (Object.keys(changedValues).length === 0) {
            // No changes to submit
            toast.info('No changes detected.');
            return;
        }

        const formData = new FormData();
        Object.entries(changedValues).forEach(([key, value]) => {
            if (key === 'image' && value) {
                formData.append(key, value); // Handle file specifically
            } else {
                formData.append(key, value);
            }
        });

        if (data) {
            await updateData(apiConfig?.UPDATE_CAROUSEL + data?._id, formData);
        } else {
            await postData(apiConfig?.CREATE_CAROUSEL, formData);
        }
    };

    const reset = () => {
        formik?.resetForm();
        queryClient.invalidateQueries(['carousel']);
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
            <div className='grid gap-2 w-full'>
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

                {data?.image && (
                    <img
                        src={data?.image}
                        alt='existing image'
                        className='w-full h-40 object-cover rounded-lg border border-dashed'
                    />
                )}

                <InputWrapper
                    label='Profile Image'
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
            </div>

            <div className='flex items-center space-x-2'>
                <Reset />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
