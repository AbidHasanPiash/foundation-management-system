'use client';
import React, { useState } from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import FormikSunEditor from '@/components/admin/sun-editor/FormikSunEditor';
import Submit from '@/components/button/Submit';
import Reset from '@/components/button/Reset';
import { Field, Form, Formik } from 'formik';
import { Input } from '@/components/ui/input';
import * as Yup from 'yup';
import {
    handleArrayFieldChangeForForm,
    handleImageChangeForForm,
} from '@/util/formikHelpers';
import Add from '@/components/button/Add';
import Remove from '@/components/button/Remove';
import { Error } from '@/components/ui/error';
import ComboboxFormik from '@/components/ui/ComboboxFormik';
import apiConfig from '@/configs/apiConfig';
import { fetchData, postData, updateData } from '@/util/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function EventForm({
    data,
    isSpacialCategory,
    category,
    subCategory,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const route = useRouter();
    const queryClient = useQueryClient();
    const initialValues = {
        title: data?.title || '',
        eventDate: data?.eventDate || '',
        banner: '',
        categoryId: category || '',
        subcategoryId: subCategory || '',
        statusId: data?.statusId || '',
        specialFormId: data?.specialFormId || '',
        description: data?.description || '',
        files: data?.files || [
            {
                name: '',
                file: null,
            },
        ],
        links: data?.links || [
            {
                name: '',
                link: null,
            },
        ],
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        eventDate: Yup.date()
            .required('Join date is required')
            .min(
                new Date(new Date().setHours(0, 0, 0, 0)),
                'Event date cannot be in the past'
            ),
        banner: Yup.lazy((value, { parent }) => {
            if (parent?.banner || data?.banner) {
                // If there's already a banner, no validation is needed
                return Yup.mixed();
            } else {
                // Validate banner as required and check file type
                return Yup.mixed()
                    .required('Banner is required')
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
        statusId: Yup.string().required('Title is required'),
        specialFormId: Yup.string(),
        description: Yup.string().required('Description is required'),
        files: Yup.array().of(
            Yup.object({
                name: Yup.string(),
                // .required('File name is required'),
                file: Yup.mixed()
                    // .required('File is required')
                    .nullable()
                    .test(
                        'fileType',
                        'Only PDF files are allowed',
                        (value) =>
                            !value ||
                            (value && value.type === 'application/pdf')
                    ),
            })
        ),
        links: Yup.array().of(
            Yup.object({
                name: Yup.string(),
                // .required('Link name is required'),
                link: Yup.string()
                    // .required('Link is required')
                    .nullable()
                    .url('Must be a valid URL'),
            })
        ),
    });

    const onSubmit = async (values) => {
        setIsLoading(true);
        const formData = new FormData();

        // Helper function to append only non-empty values
        const appendIfPresent = (key, value) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value);
            }
        };

        // Append simple fields
        appendIfPresent('title', values.title);
        appendIfPresent('eventDate', values.eventDate);
        appendIfPresent('categoryId', values.categoryId);
        appendIfPresent('subcategoryId', values.subcategoryId);
        appendIfPresent('statusId', values.statusId);
        appendIfPresent('description', values.description);

        // Append banner if it exists
        appendIfPresent('banner', values.banner);

        // Append specialFormId if it exists
        appendIfPresent('specialFormId', values.specialFormId);

        // Append files array if present
        // if (values.files && values.files.length > 0) {
        //     values.files.forEach((fileObj, index) => {
        //         appendIfPresent(`files[${index}][name]`, fileObj.name);
        //         appendIfPresent(`files[${index}][file]`, fileObj.file);
        //     });
        // }

        if (values.files && values.files.length > 0) {
            values.files.forEach((fileObj, index) => {
                if (fileObj.document instanceof File) {
                    appendIfPresent(`files[${index}].name`, fileObj.name);
                    appendIfPresent(`files[${index}].file`, fileObj.file);
                } else if (typeof fileObj.link === 'string') {
                    appendIfPresent(`files[${index}].link`, fileObj.link);
                    appendIfPresent(`files[${index}].name`, fileObj.name);
                }
            });
        }

        // Append links array if present
        if (values.links && values.links.length > 0) {
            values.links.forEach((linkObj, index) => {
                appendIfPresent(`links[${index}].name`, linkObj.name);
                appendIfPresent(`links[${index}].link`, linkObj.link);
            });
        }

        // Call the appropriate API based on the presence of `data`
        if (data) {
            await updateData(apiConfig?.UPDATE_EVENT + data?._id, formData);
            setIsLoading(false);
        } else {
            await postData(apiConfig?.CREATE_EVENT, formData);
            setIsLoading(false);
        }

        // Invalidate cache
        queryClient.invalidateQueries(['events']);
        setIsLoading(false);
        route.back();
    };

    const { isLoading: eventStatusLoading, data: eventStatus } = useQuery({
        queryKey: ['eventStatus'],
        queryFn: async () => await fetchData(apiConfig?.GET_EVENT_STATUS),
    });

    const { isLoading: eventSpecialFormLoading, data: eventSpecialForm } =
        useQuery({
            queryKey: ['eventSpecialForm'],
            queryFn: async () =>
                await fetchData(apiConfig?.GET_SCHOLARSHIP_FORM),
        });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, values, setFieldValue, resetForm }) => (
                <Form className='space-y-4'>
                    <InputWrapper
                        label='Event Title'
                        error={errors.title}
                        touched={touched.title}
                    >
                        <Field
                            as={Input}
                            name='title'
                            placeholder='Enter title'
                        />
                    </InputWrapper>

                    <div>
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
                    </div>

                    <div
                        className={`grid ${isSpacialCategory ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-2`}
                    >
                        <InputWrapper
                            label='Event Date'
                            error={errors.eventDate}
                            touched={touched.eventDate}
                        >
                            <Field as={Input} type='date' name='eventDate' />
                        </InputWrapper>

                        <InputWrapper
                            label='Status'
                            error={errors?.statusId}
                            touched={touched?.statusId}
                        >
                            <ComboboxFormik
                                select='_id'
                                display='status'
                                name='statusId'
                                formik={{ values, setFieldValue }}
                                data={eventStatus}
                            />
                        </InputWrapper>
                        <div hidden={!isSpacialCategory}>
                            <InputWrapper
                                InputWrapper
                                label='Attach a form'
                                error={errors?.specialFormId}
                                touched={touched?.specialFormId}
                            >
                                <ComboboxFormik
                                    select='_id'
                                    display='formTitle'
                                    description='formName'
                                    name='specialFormId'
                                    formik={{ values, setFieldValue }}
                                    data={eventSpecialForm}
                                    disable={!isSpacialCategory}
                                />
                            </InputWrapper>
                        </div>
                    </div>

                    {/* files Field Array */}
                    <div className='space-y-2'>
                        <InputWrapper label='PDF files'>
                            {values.files.map((file, index) => (
                                <div
                                    key={index}
                                    className='flex gap-2 items-start justify-between'
                                >
                                    <div className='w-full'>
                                        <Input
                                            name={`files[${index}].name`}
                                            placeholder={`File Name ${index + 1}`}
                                            value={file.name}
                                            onChange={(e) =>
                                                setFieldValue(
                                                    `files[${index}].name`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Error
                                            error={errors.files?.[index]?.name}
                                            touched={
                                                touched.files?.[index]?.name
                                            }
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <Input
                                            type='file'
                                            accept='application/pdf'
                                            onChange={(e) =>
                                                handleImageChangeForForm(
                                                    setFieldValue,
                                                    `files[${index}].file`
                                                )(e)
                                            }
                                            className='file-input'
                                        />
                                        <Error
                                            error={errors.files?.[index]?.file}
                                            touched={
                                                touched.files?.[index]?.file
                                            }
                                        />
                                    </div>
                                    <div className='max-w-12 flex items-center'>
                                        <Remove
                                            disabled={values.files.length === 1}
                                            onClick={() =>
                                                handleArrayFieldChangeForForm(
                                                    { values, setFieldValue },
                                                    'remove',
                                                    'files',
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </InputWrapper>
                        <Add
                            label='Add File'
                            onClick={() =>
                                handleArrayFieldChangeForForm(
                                    { values, setFieldValue },
                                    'add',
                                    'files'
                                )
                            }
                        />
                    </div>

                    {/* links Field Array */}
                    <div className='space-y-2'>
                        <InputWrapper label='Additional Links'>
                            {values.links.map((link, index) => (
                                <div
                                    key={index}
                                    className='flex gap-2 items-start justify-between'
                                >
                                    <div className='w-full'>
                                        <Input
                                            name={`links[${index}].name`}
                                            placeholder={`Link Name ${index + 1}`}
                                            value={link.name}
                                            onChange={(e) =>
                                                setFieldValue(
                                                    `links[${index}].name`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Error
                                            error={errors.links?.[index]?.name}
                                            touched={
                                                touched.links?.[index]?.name
                                            }
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <Input
                                            type='link'
                                            name={`links[${index}].name`}
                                            placeholder={`Link Name ${index + 1}`}
                                            value={link.link}
                                            onChange={(e) =>
                                                setFieldValue(
                                                    `links[${index}].link`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Error
                                            error={errors.links?.[index]?.link}
                                            touched={
                                                touched.links?.[index]?.link
                                            }
                                        />
                                    </div>
                                    <div className='max-w-12 flex items-center'>
                                        <Remove
                                            disabled={values.files.length === 1}
                                            onClick={() =>
                                                handleArrayFieldChangeForForm(
                                                    { values, setFieldValue },
                                                    'remove',
                                                    'links',
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </InputWrapper>
                        <Add
                            label='Add Link'
                            onClick={() =>
                                handleArrayFieldChangeForForm(
                                    { values, setFieldValue },
                                    'add',
                                    'links'
                                )
                            }
                        />
                    </div>

                    <InputWrapper
                        label='Description'
                        error={errors.description}
                        touched={touched.description}
                    >
                        <FormikSunEditor name='description' />
                    </InputWrapper>

                    <div className='flex items-center space-x-2'>
                        <Reset onClick={resetForm} />
                        <Submit />
                    </div>
                </Form>
            )}
        </Formik>
    );
}
