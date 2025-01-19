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
import { Checkbox } from '@/components/ui/checkbox';
import { handleCheckboxChange } from '@/util/formikHelpers';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getChangedValues } from '@/util/getChangedValues';

export default function EventCategoryForm({ data }) {
    const route = useRouter();
    const queryClient = useQueryClient();
    const initialValues = {
        category: data?.category || '',
        isSpecial: data?.isSpecial || false,
    };

    const validationSchema = Yup.object({
        category: Yup.string().required('Required field'),
    });

    const submit = async (values) => {
        const changedValues = getChangedValues(initialValues, values);

        if (Object.keys(changedValues).length === 0) {
            // No changes to submit
            toast.info('No changes detected.');
            return;
        }

        if (data) {
            await updateData(
                apiConfig?.UPDATE_EVENT_CATEGORY + data?._id,
                changedValues
            );
        } else {
            await postData(apiConfig?.CREATE_EVENT_CATEGORY, values);
        }
    };

    const reset = () => {
        formik?.resetForm();
        queryClient.invalidateQueries(['category']);
        route.back();
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
        validateOnBlur: true,
        validateOnChange: true,
    });

    const mutation = useMutation({
        mutationKey: ['event-category'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-2 gap-2 w-full'>
                <InputWrapper
                    label='Category'
                    error={formik.errors?.category}
                    touched={formik.touched?.category}
                >
                    <Input
                        name='category'
                        placeholder='Category'
                        value={formik.values?.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper label='Is this special ?'>
                    <label className='flex items-center space-x-2 border border-border p-2 rounded-md text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                        <span>Make this category as special</span>
                        <Checkbox
                            checked={formik.values.isSpecial}
                            onCheckedChange={handleCheckboxChange(
                                formik,
                                'isSpecial'
                            )}
                        />
                    </label>
                </InputWrapper>
            </div>

            <div className='flex items-center space-x-2'>
                <Submit disabled={mutation.isPending || mutation.isSuccess} />
            </div>
        </form>
    );
}
