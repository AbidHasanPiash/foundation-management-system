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
import ComboboxFormik from '@/components/ui/ComboboxFormik';

export default function AdvanceStatusForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        status: data?.status || '',
        category: '',
    };

    const validationSchema = Yup.object({
        status: Yup.string().required('Required field'),
        category: Yup.string().required('Required field'),
    });

    const submit = async (values) => {
        const dataToSend = {
            status: values.status,
        };
        if (data) {
            await updateData(
                `${apiConfig?.UPDATE_STATUS_BY_CATEGORY}${values?.category}/${data?._id}`,
                dataToSend
            );
        } else {
            await postData(
                `${apiConfig?.CREATE_STATUS_BY_CATEGORY}${values?.category}`,
                dataToSend
            );
        }
        queryClient.invalidateQueries(['allStatus']);
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
        mutationKey: ['createBenefitsOfMembers'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    const categories = [
        {
            id: 'event',
            name: 'Event',
        },
        {
            id: 'team',
            name: 'Team',
        },
        {
            id: 'member',
            name: 'Member',
        },
        {
            id: 'payment_method',
            name: 'Payment Method',
        },
        {
            id: 'event_form_scholarship',
            name: 'Scholarship Form',
        },
        {
            id: 'event_form_talend_pool_scholarship',
            name: 'Talentpool Form',
        },
    ];

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-2 gap-2 w-full'>
                <InputWrapper
                    label='Status'
                    error={formik.errors?.status}
                    touched={formik.touched?.status}
                >
                    <Input
                        name='status'
                        placeholder='Status'
                        value={formik.values?.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
                <InputWrapper
                    label='Category'
                    error={formik.errors?.category}
                    touched={formik.touched?.category}
                >
                    <ComboboxFormik
                        select='id'
                        display='name'
                        name='category'
                        formik={formik}
                        data={categories}
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
