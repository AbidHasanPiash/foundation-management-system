'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { fetchData, postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import ComboboxFormikMultiSelect from '@/components/ui/ComboboxFormikMultiSelect';
import { handleArrayFieldChange } from '@/util/formikHelpers';
import { Error } from '@/components/ui/error';
import Remove from '@/components/button/Remove';
import Add from '@/components/button/Add';

export default function ScholarshipInfoForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        formTitle: data?.formTitle || '',
        formName: data?.formName || '',
        venue: data?.venue || '',
        lastDate: data?.lastDate?.split('T')[0] || '',
        eligibleSchools: data?.eligibleSchools || [],
        exam: data?.exam || [
            {
                subject: '',
                date: '',
                time: '',
            },
        ],
        note: data?.note || [''],
    };

    const validationSchema = Yup.object({
        formTitle: Yup.string().required('Required field'),
        formName: Yup.string().required('Required field'),
        venue: Yup.string().required('Required field'),
        lastDate: Yup.date()
            .required('Last date is required')
            .min(new Date(), 'Last date cannot be in the past'),
        eligibleSchools: Yup.array()
            .of(Yup.string().required('Each institute must be a valid string'))
            .min(1, 'At least one eligible institute is required')
            .required('Required field'),
        exam: Yup.array()
            .of(
                Yup.object({
                    subject: Yup.string().required('Subject is required'),
                    date: Yup.date()
                        .required('Date is required')
                        .min(new Date(), 'Date cannot be in the past'),
                    time: Yup.string().required('Time is required'),
                })
            )
            .min(1, 'At least one exam entry is required')
            .optional(),
        note: Yup.array().of(Yup.string()).optional(),
    });

    const submit = async (values) => {
        if (data) {
            await updateData(
                apiConfig?.UPDATE_SCHOLARSHIP_FORM + data?._id,
                values
            );
        } else {
            await postData(apiConfig?.CREATE_SCHOLARSHIP_FORM, values);
        }
        queryClient.invalidateQueries(['scholarship']);
    };

    const reset = () => {
        formik?.resetForm();
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
        validateOnBlur: true,
        validateOnChange: true,
    });

    const mutation = useMutation({
        mutationKey: ['scholarshipInfo'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    const { isLoading: eligibleSchoolLoading, data: eligibleSchool } = useQuery(
        {
            queryKey: ['eligibleInstitute'],
            queryFn: async () =>
                await fetchData(apiConfig?.GET_ELIGIBLE_INSTITUTE),
        }
    );

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-2 gap-2 w-full'>
                <InputWrapper
                    label='Form Title'
                    error={formik.errors?.formTitle}
                    touched={formik.touched?.formTitle}
                >
                    <Input
                        name='formTitle'
                        placeholder='Form Title'
                        value={formik.values?.formTitle}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Form Name'
                    error={formik.errors?.formName}
                    touched={formik.touched?.formName}
                >
                    <Input
                        name='formName'
                        placeholder='Form Name'
                        value={formik.values?.formName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Venue'
                    error={formik.errors?.venue}
                    touched={formik.touched?.venue}
                >
                    <Input
                        name='venue'
                        placeholder='Venue'
                        value={formik.values?.venue}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Last Date'
                    error={formik.errors?.lastDate}
                    touched={formik.touched?.lastDate}
                >
                    <Input
                        type='date'
                        name='lastDate'
                        value={formik.values?.lastDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Eligible Institute'
                    error={formik.errors?.eligibleSchools}
                    touched={formik.touched?.eligibleSchools}
                    className={'md:col-span-2'}
                >
                    <ComboboxFormikMultiSelect
                        select='_id'
                        display='name'
                        name='eligibleSchools'
                        formik={formik}
                        data={eligibleSchool}
                    />
                </InputWrapper>

                <div className='space-y-2 md:col-span-2'>
                    <InputWrapper label='Exam Details'>
                        {formik?.values?.exam.map((exam, index) => (
                            <div
                                key={index}
                                className='flex gap-2 items-start justify-between'
                            >
                                <div className='w-full'>
                                    <Input
                                        name={`exam[${index}].subject`}
                                        placeholder={`Subject Name ${index + 1}`}
                                        value={exam.subject}
                                        onChange={(e) =>
                                            formik?.setFieldValue(
                                                `exam[${index}].subject`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Error
                                        error={
                                            formik?.errors.exam?.[index]
                                                ?.subject
                                        }
                                        touched={
                                            formik?.touched.exam?.[index]
                                                ?.subject
                                        }
                                    />
                                </div>
                                <div className='w-full'>
                                    <Input
                                        type='date'
                                        name={`exam[${index}].date`}
                                        value={exam.date}
                                        onChange={(e) =>
                                            formik?.setFieldValue(
                                                `exam[${index}].date`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Error
                                        error={
                                            formik?.errors.exam?.[index]?.date
                                        }
                                        touched={
                                            formik?.touched.exam?.[index]?.date
                                        }
                                    />
                                </div>
                                <div className='w-full'>
                                    <Input
                                        type='time'
                                        name={`exam[${index}].time`}
                                        value={exam.time}
                                        onChange={(e) =>
                                            formik?.setFieldValue(
                                                `exam[${index}].time`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Error
                                        error={
                                            formik?.errors.exam?.[index]?.time
                                        }
                                        touched={
                                            formik?.touched.exam?.[index]?.time
                                        }
                                    />
                                </div>
                                <div className='max-w-12 flex items-center'>
                                    <Remove
                                        disabled={
                                            formik?.values.exam.length === 1
                                        }
                                        onClick={() =>
                                            handleArrayFieldChange(
                                                formik,
                                                'remove',
                                                'exam',
                                                index
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </InputWrapper>
                    <Add
                        label='Add Exam'
                        onClick={() =>
                            handleArrayFieldChange(formik, 'add', 'exam')
                        }
                    />
                </div>

                <div className='space-y-2 md:col-span-2'>
                    <InputWrapper label='Notes'>
                        {formik?.values?.note.map((note, index) => (
                            <div
                                key={index}
                                className='flex gap-2 items-start justify-between'
                            >
                                <div className='w-full'>
                                    <Input
                                        name={`note[${index}]`}
                                        placeholder={`Note ${index + 1}`}
                                        value={note}
                                        onChange={(e) =>
                                            formik?.setFieldValue(
                                                `note[${index}]`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Error
                                        error={formik?.errors.note?.[index]}
                                        touched={formik?.touched.note?.[index]}
                                    />
                                </div>
                                <div className='max-w-12 flex items-center'>
                                    <Remove
                                        disabled={
                                            formik?.values.note.length === 1
                                        }
                                        onClick={() =>
                                            handleArrayFieldChange(
                                                formik,
                                                'remove',
                                                'note',
                                                index
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </InputWrapper>
                    <Add
                        label='Add Note'
                        onClick={() =>
                            handleArrayFieldChange(formik, 'add', 'note')
                        }
                    />
                </div>
            </div>

            <div className='flex items-center space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
