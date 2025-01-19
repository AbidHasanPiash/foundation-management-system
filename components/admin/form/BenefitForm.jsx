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

export default function BenefitForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        text: data?.text || '',
    };

    const validationSchema = Yup.object({
        text: Yup.string().required('Required field'),
    });

    const submit = async (values) => {
        if (data) {
            await updateData(
                apiConfig?.UPDATE_BENEFITS_OF_MEMBERS + data?._id,
                values
            );
        } else {
            await postData(apiConfig?.CREATE_BENEFITS_OF_MEMBERS, values);
        }
    };

    const reset = () => {
        formik?.resetForm();
        queryClient.invalidateQueries(['benefitsOfMembers']);
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
                    label='Benefit'
                    error={formik.errors?.text}
                    touched={formik.touched?.text}
                >
                    <Input
                        name='text'
                        placeholder='Benefit'
                        value={formik.values?.text}
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
