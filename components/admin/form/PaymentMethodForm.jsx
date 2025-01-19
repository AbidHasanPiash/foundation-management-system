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

export default function PaymentMethodForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        type: data?.type || '',
    };

    const validationSchema = Yup.object({
        type: Yup.string().required('Required field'),
    });

    const submit = async (values) => {
        if (data) {
            await updateData(
                apiConfig?.UPDATE_PAYMENT_METHOD + data?._id,
                values
            );
        } else {
            await postData(apiConfig?.CREATE_PAYMENT_METHOD, values);
        }
    };

    const reset = () => {
        formik?.resetForm();
        queryClient.invalidateQueries(['payment-method']);
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
                    label='Payment Method'
                    error={formik.errors?.type}
                    touched={formik.touched?.type}
                >
                    <Input
                        name='type'
                        placeholder='Payment Method'
                        value={formik.values?.type}
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
