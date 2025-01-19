'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { handleImageChange } from '@/util/formikHelpers';
import ComboboxFormik from '@/components/ui/ComboboxFormik';
import { fetchData, postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import { useRouter } from 'next/navigation';

export default function TeamForm({ data }) {
    const route = useRouter();
    const initialValues = {
        name: data?.name || '',
        email: data?.email || '',
        image: '',
        joinDate: data?.joinDate.split('T')[0] || '',
        designation: data?.designation || '',
        organization: data?.organization || '',
        typeId: data?.typeId || '',
        statusId: data?.statusId || '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required field'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Required field'),
        image: Yup.mixed()
            // .required('Image is required')
            .test(
                'fileSize',
                'File size too large',
                (value) => !value || (value && value.size <= 2000000)
            ) // 2MB limit
            .test(
                'fileType',
                'Unsupported file format',
                (value) =>
                    !value ||
                    [
                        'image/png',
                        'image/jpeg',
                        'image/jpg',
                        'image/gif',
                    ].includes(value.type)
            ),
        joinDate: Yup.date()
            .required('Join date is required')
            .max(new Date(), 'Join date cannot be in the future'),
        designation: Yup.string().required('Required field'),
        organization: Yup.string().required('Required field'),
        typeId: Yup.string().required('Please select a team type'),
        statusId: Yup.string().required('Please select a status'),
    });

    const submit = async (values) => {
        const formData = new FormData();
        if (values.image) {
            formData.append('image', values.image);
        }
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('joinDate', values.joinDate);
        formData.append('designation', values.designation);
        formData.append('organization', values.organization);
        formData.append('typeId', values.typeId);
        formData.append('statusId', values.statusId);

        if (data) {
            await updateData(
                apiConfig?.UPDATE_TEAM_COMMITTEE + data?._id,
                formData
            );
        } else {
            await postData(apiConfig?.CREATE_TEAM_COMMITTEE, formData);
        }
    };

    const reset = () => {
        formik?.resetForm();
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
        mutationKey: ['team'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    const { isLoading: teamTypeLoading, data: teamType } = useQuery({
        queryKey: ['team-type'],
        queryFn: async () => await fetchData(apiConfig?.GET_TEAM_TYPE),
    });

    const { isLoading: teamStatusLoading, data: teamStatus } = useQuery({
        queryKey: ['team-status'],
        queryFn: async () => await fetchData(apiConfig?.GET_TEAM_STATUS),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-2 gap-2 w-full'>
                <InputWrapper
                    label='Name'
                    error={formik.errors?.name}
                    touched={formik.touched?.name}
                >
                    <Input
                        name='name'
                        placeholder='Your Name'
                        value={formik.values?.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Profile Image'
                    error={formik.errors?.image}
                    touched={formik.touched?.image}
                >
                    <Input
                        type='file'
                        name='image'
                        accept='image/png, image/gif, image/jpeg, image/jpg'
                        onChange={handleImageChange(formik, 'image')}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Email'
                    error={formik.errors?.email}
                    touched={formik.touched?.email}
                >
                    <Input
                        type='email'
                        name='email'
                        placeholder='Your Email'
                        value={formik.values?.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Join Date'
                    error={formik.errors?.joinDate}
                    touched={formik.touched?.joinDate}
                >
                    <Input
                        type='date'
                        name='joinDate'
                        value={formik.values?.joinDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Designation'
                    error={formik.errors?.designation}
                    touched={formik.touched?.designation}
                >
                    <Input
                        name='designation'
                        placeholder='Your Designation'
                        value={formik.values?.designation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Organization'
                    error={formik.errors?.organization}
                    touched={formik.touched?.organization}
                >
                    <Input
                        name='organization'
                        placeholder='Your Organization'
                        value={formik.values?.organization}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Team Type'
                    error={formik.errors?.typeId}
                    touched={formik.touched?.typeId}
                >
                    <ComboboxFormik
                        select='_id'
                        display='type'
                        name='typeId'
                        formik={formik}
                        data={teamType}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Status'
                    error={formik.errors?.statusId}
                    touched={formik.touched?.statusId}
                >
                    <ComboboxFormik
                        select='_id'
                        display='status'
                        name='statusId'
                        formik={formik}
                        data={teamStatus}
                    />
                </InputWrapper>
            </div>

            <div className='flex items-center space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending || mutation.isSuccess} />
            </div>
        </form>
    );
}
