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

export default function AdvanceTypeForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        type: data?.type || '',
        category: '',
    };

    const validationSchema = Yup.object({
        type: Yup.string().required('Required field'),
        category: Yup.string().required('Required field'),
    });

    const submit = async (values) => {
        const dataToSend = {
            type: values.type,
        };
        if (data) {
            await updateData(
                `${apiConfig?.UPDATE_TYPE_BY_CATEGORY}${values?.category}/${data?._id}`,
                dataToSend
            );
        } else {
            await postData(
                `${apiConfig?.CREATE_TYPE_BY_CATEGORY}${values?.category}`,
                dataToSend
            );
        }
        queryClient.invalidateQueries(['allType']);
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
    ];

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-2 gap-2 w-full'>
                <InputWrapper
                    label='Type'
                    error={formik.errors?.type}
                    touched={formik.touched?.type}
                >
                    <Input
                        name='type'
                        placeholder='Type'
                        value={formik.values?.type}
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
