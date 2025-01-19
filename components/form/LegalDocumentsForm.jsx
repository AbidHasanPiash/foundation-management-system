'use client';
import React from 'react';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RiSendPlaneLine } from 'react-icons/ri';
import Spinner from '../common/Spinner';
import { postData, updateData } from '@/util/axios';
import FormPdfViewer from '../admin/common/FormPdfViewer';

export default function LegalDocumentsForm({ data, updateAPI, createAPI }) {
    const queryClient = useQueryClient();
    const initialValues = {
        title: data?.title || '',
        effectiveDate: data?.effectiveDate || '',
        description: data?.description || '',
        documents: data?.documents || [
            {
                name: '',
                document: null,
            },
        ],
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        effectiveDate: Yup.date().required('Effective Date is required'),
        description: Yup.string(),
        documents: Yup.array().of(
            Yup.object({
                name: Yup.string(),
                document: Yup.mixed(),
            })
        ),
    });

    const submit = async (values) => {
        const formData = new FormData();

        // Helper function to append only non-empty values
        const appendIfPresent = (key, value) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value);
            }
        };
        appendIfPresent('title', values.title);
        appendIfPresent('effectiveDate', values.effectiveDate);
        appendIfPresent('description', values.description);

        // Append documents array
        if (values.documents && values.documents.length > 0) {
            values.documents.forEach((fileObj, index) => {
                if (fileObj.document instanceof File) {
                    appendIfPresent(`documents[${index}].name`, fileObj.name);
                    appendIfPresent(
                        `documents[${index}].document`,
                        fileObj.document
                    );
                } else if (typeof fileObj.link === 'string') {
                    appendIfPresent(`documents[${index}].link`, fileObj.link);
                    appendIfPresent(`documents[${index}].name`, fileObj.name);
                    appendIfPresent(`documents[${index}].id`, fileObj.id);
                    appendIfPresent(`documents[${index}]._id`, fileObj._id);
                }
            });
        }

        if (data) {
            await updateData(updateAPI, formData);
        } else {
            await postData(createAPI, formData);
        }
    };

    const onSuccess = () => {
        // Invalidate cache
        queryClient.invalidateQueries(['legalDocument']);
    };

    const mutation = useMutation({
        mutationKey: ['createLegalDocument'],
        mutationFn: async (data) => submit(data),
        onSuccess,
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={mutation.mutate}
        >
            {({ errors, touched, values, setFieldValue, resetForm }) => (
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

                    <InputWrapper
                        label='Effective Date'
                        error={errors.effectiveDate}
                        touched={touched.effectiveDate}
                    >
                        <Field as={Input} type='date' name='effectiveDate' />
                    </InputWrapper>

                    {/* Documents Field Array */}
                    <div className='space-y-2'>
                        <InputWrapper label='PDF Documents'>
                            {values.documents.map((document, index) => (
                                <div
                                    key={index}
                                    className='flex gap-2 items-start justify-between'
                                >
                                    <div className='w-full'>
                                        <Input
                                            name={`documents[${index}].name`}
                                            placeholder={`Document Name ${index + 1}`}
                                            value={document.name}
                                            onChange={(e) =>
                                                setFieldValue(
                                                    `documents[${index}].name`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Error
                                            error={
                                                errors.documents?.[index]?.name
                                            }
                                            touched={
                                                touched.documents?.[index]?.name
                                            }
                                        />
                                    </div>
                                    <div className='w-full'>
                                        {/* Check if document is a link */}
                                        {typeof document.link === 'string' &&
                                        document.link ? (
                                            <FormPdfViewer
                                                link={document?.link}
                                                name={document?.name}
                                            />
                                        ) : (
                                            // Render file input if it's a new document
                                            <Input
                                                type='file'
                                                accept='application/pdf'
                                                onChange={(e) =>
                                                    handleImageChangeForForm(
                                                        setFieldValue,
                                                        `documents[${index}].document`
                                                    )(e)
                                                }
                                                className='file-input'
                                            />
                                        )}
                                        <Error
                                            error={
                                                errors.documents?.[index]
                                                    ?.document
                                            }
                                            touched={
                                                touched.documents?.[index]
                                                    ?.document
                                            }
                                        />
                                    </div>
                                    <div className='max-w-12 flex items-center'>
                                        <Remove
                                            disabled={
                                                values.documents.length === 1
                                            }
                                            onClick={() =>
                                                handleArrayFieldChangeForForm(
                                                    { values, setFieldValue },
                                                    'remove',
                                                    'documents',
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </InputWrapper>
                        <Add
                            label='Add Document'
                            onClick={() =>
                                handleArrayFieldChangeForForm(
                                    { values, setFieldValue },
                                    'add',
                                    'documents'
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
                        <Submit
                            // disabled={mutation.isPending || mutation.isSuccess}
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
