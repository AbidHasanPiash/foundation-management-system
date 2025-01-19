'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import FormikSunEditor from '@/components/admin/sun-editor/FormikSunEditor';
import Submit from '@/components/button/Submit';
import Reset from '@/components/button/Reset';
import { Field, Form, Formik } from 'formik';
import { Input } from '@/components/ui/input';
import * as Yup from 'yup';
import { postData, updateData } from '@/util/axios';
import { useMutation } from '@tanstack/react-query';
import Spinner from '../common/Spinner';
import { RiSendPlaneLine } from 'react-icons/ri';

export default function AboutForm({ data, refetch, updateAPI, createAPI }) {
    const initialValues = {
        title: data?.title || '',
        banner: '',
        description: data?.description || '',
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        banner: Yup.mixed()
            // .required('Banner is required')
            .test(
                'fileType',
                'Unsupported file format. Only images are allowed',
                (value) =>
                    !value ||
                    (value &&
                        [
                            'image/jpeg',
                            'image/jpg',
                            'image/png',
                            'image/gif',
                        ].includes(value.type))
            ),
        description: Yup.string().required('Description is required'),
    });

    const submit = async (values) => {
        const formData = new FormData();
        if (values.banner) {
            formData.append('banner', values.banner);
        }
        formData.append('title', values.title);
        formData.append('description', values.description);

        if (data) {
            await updateData(updateAPI, formData);
        } else {
            await postData(createAPI, formData);
        }
    };

    const mutation = useMutation({
        mutationKey: ['mission'],
        mutationFn: async (data) => submit(data),
        onSuccess: () => refetch(),
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={mutation.mutate}
        >
            {({ errors, touched, setFieldValue, resetForm }) => (
                <Form className='space-y-4'>
                    <InputWrapper
                        label='Title'
                        error={errors.title}
                        touched={touched.title}
                    >
                        <Field
                            as={Input}
                            name='title'
                            placeholder='Enter title'
                        />
                    </InputWrapper>

                    {data?.banner && (
                        <img
                            src={data?.banner}
                            alt={data?.title}
                            className='w-full h-40 object-cover rounded-lg border border-dashed'
                        />
                    )}
                    <InputWrapper
                        label='Banner'
                        error={errors.banner}
                        touched={touched.banner}
                    >
                        <Input
                            type='file'
                            name='banner'
                            accept='image/*'
                            onChange={(event) =>
                                setFieldValue(
                                    'banner',
                                    event.currentTarget.files[0]
                                )
                            }
                        />
                    </InputWrapper>

                    <InputWrapper
                        label='Description'
                        error={errors.description}
                        touched={touched.description}
                    >
                        <FormikSunEditor name='description' />
                    </InputWrapper>

                    <div className='flex items-center space-x-2'>
                        <Reset onClick={resetForm} />
                        <Submit
                            disabled={mutation.isPending || mutation.isSuccess}
                            label={
                                mutation.isPending ? 'Submitting...' : 'Submit'
                            } // Dynamic label
                            icon={
                                mutation.isPending ? (
                                    <Spinner size='4' />
                                ) : (
                                    <RiSendPlaneLine />
                                )
                            } // Dynamic icon
                        />
                    </div>
                </Form>
            )}
        </Formik>
    );
}
