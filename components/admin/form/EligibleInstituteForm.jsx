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

export default function EligibleInstituteForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        name: data?.name || '',
        address: data?.address || '',
        contactPerson: data?.contactPerson || '',
        contactNo: data?.contactNo || '',
        headOfInstitute: data?.headOfInstitute || '',
        headOfInstituteNumber: data?.headOfInstituteNumber || '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required field'),
        address: Yup.string().required('Required field'),
        contactPerson: Yup.string(),
        contactNo: Yup.string(),
        headOfInstitute: Yup.string().required('Required field'),
        headOfInstituteNumber: Yup.string(),
    });

    const submit = async (values) => {
        // Convert the institute name to uppercase
        const formattedValues = {
            ...values,
            name: values.name.toUpperCase(),
        };

        if (data) {
            await updateData(
                apiConfig?.UPDATE_ELIGIBLE_INSTITUTE + data?._id,
                formattedValues
            );
        } else {
            await postData(
                apiConfig?.CREATE_ELIGIBLE_INSTITUTE,
                formattedValues
            );
        }
        queryClient.invalidateQueries(['eligibleSchool']);
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
        mutationKey: ['createEligibleInstitute'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-2 gap-2 w-full'>
                <InputWrapper
                    className={'md:col-span-2'}
                    label='School Name'
                    error={formik.errors?.name}
                    touched={formik.touched?.name}
                >
                    <Input
                        name='name'
                        placeholder='School Name'
                        value={formik.values?.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Contact Person Name'
                    error={formik.errors?.contactPerson}
                    touched={formik.touched?.contactPerson}
                >
                    <Input
                        name='contactPerson'
                        placeholder='Contact Person Name'
                        value={formik.values?.contactPerson}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Contact Person Phone Number'
                    error={formik.errors?.contactNo}
                    touched={formik.touched?.contactNo}
                >
                    <Input
                        name='contactNo'
                        placeholder='Contact Person Phone Number'
                        value={formik.values?.contactNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Head Of Institute'
                    error={formik.errors?.headOfInstitute}
                    touched={formik.touched?.headOfInstitute}
                >
                    <Input
                        name='headOfInstitute'
                        placeholder='Head Of Institute'
                        value={formik.values?.headOfInstitute}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Head Of Institute Phone Number'
                    error={formik.errors?.headOfInstituteNumber}
                    touched={formik.touched?.headOfInstituteNumber}
                >
                    <Input
                        name='headOfInstituteNumber'
                        placeholder='Head Of Institute'
                        value={formik.values?.headOfInstituteNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    className={'md:col-span-2'}
                    label='School Address'
                    error={formik.errors?.address}
                    touched={formik.touched?.address}
                >
                    <Input
                        name='address'
                        placeholder='School Address'
                        value={formik.values?.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
