'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import Add from '@/components/button/Add';
import Remove from '@/components/button/Remove';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import {
    handleArrayFieldChange,
    handleImageChange,
} from '@/util/formikHelpers';
import { postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';

export default function OrganizationInfoForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        name: data?.name || '',
        description: data?.description || '',
        logo: '',
        startDate: data?.startDate || '',
        address: data?.address || '',
        emails: data?.emails || [''],
        contacts: data?.contacts || [''],
        socialLinks: data?.socialLinks || [''],
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required field'),
        description: Yup.string(),
        startDate: Yup.date()
            .required('Date is required')
            .max(new Date(), 'Date cannot be in the future'),
        logo: Yup.mixed()
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
        address: Yup.string().required('Address is required'),
        emails: Yup.array()
            .of(
                Yup.string()
                    .email('Invalid email address')
                    .required('Email is required')
            )
            .min(1, 'At least one email is required'),
        contacts: Yup.array()
            .of(
                Yup.string()
                    .matches(
                        /^(?:\+?88)?01[3-9]\d{8}$/,
                        'Invalid Bangladeshi phone number'
                    )
                    .required('Contact number is required')
            )
            .min(1, 'At least one contact is required'),
        socialLinks: Yup.array()
            .of(
                Yup.string()
                    .url('Must be a valid URL')
                    .required('Social link is required')
            )
            .min(1, 'At least one social link is required'),
    });

    const submit = async (values) => {
        const formData = new FormData();

        // Add simple fields
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('address', values.address);
        formData.append('startDate', values.startDate);
        // Add logo (assumes it’s a file input; if it's a URL string, modify accordingly)
        if (values.logo instanceof File) {
            formData.append('logo', values.logo);
        }
        // Add arrays (emails, contacts, socialLinks)
        values.emails.forEach((email) => formData.append('emails', email));
        values.contacts.forEach((contact) =>
            formData.append('contacts', contact)
        );
        values.socialLinks.forEach((link) =>
            formData.append('socialLinks', link)
        );

        if (data) {
            await updateData(apiConfig?.CREATE_GENERAL_INFO, formData);
        } else {
            await postData(apiConfig?.CREATE_GENERAL_INFO, formData);
        }
    };

    const reset = () => {
        // formik?.resetForm();
        queryClient.invalidateQueries(['generalInfo']);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
        validateOnBlur: true,
        validateOnChange: true,
    });

    const mutation = useMutation({
        mutationKey: ['organization'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid gap-2 w-full'>
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
                    label='Description'
                    error={formik.errors?.description}
                    touched={formik.touched?.description}
                >
                    <Textarea
                        name='description'
                        placeholder='Description of the Organization'
                        rows={3}
                        value={formik.values?.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <div className='grid md:grid-cols-2 gap-2 w-full'>
                    <InputWrapper
                        label='Start Date'
                        error={formik.errors?.startDate}
                        touched={formik.touched?.startDate}
                    >
                        <Input
                            type='date'
                            name='startDate'
                            value={formik.values?.startDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>
                    <div className='flex gap-2 items-center'>
                        <InputWrapper
                            label='Logo URL'
                            error={formik.errors?.logo}
                            touched={formik.touched?.logo}
                        >
                            <Input
                                name='logo'
                                type='file'
                                accept='image/png, image/gif, image/jpeg, image/jpg'
                                onChange={handleImageChange(formik, 'logo')}
                                onBlur={formik.handleBlur}
                            />
                        </InputWrapper>

                        {data?.logo && (
                            <img
                                src={data?.logo}
                                alt='Logo'
                                className='w-20 h-20'
                            />
                        )}
                    </div>
                </div>

                <InputWrapper
                    label='Address'
                    error={formik.errors?.address}
                    touched={formik.touched?.address}
                >
                    <Input
                        name='address'
                        placeholder='Address'
                        value={formik.values?.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                {/* Emails Field Array */}
                <div className='space-y-2'>
                    <InputWrapper
                        label='Emails'
                        error={formik.errors?.emails}
                        touched={formik.touched?.emails}
                    >
                        {formik.values.emails.map((_, index) => (
                            <div
                                key={index}
                                className='flex gap-2 items-center'
                            >
                                <Input
                                    name={`emails[${index}]`}
                                    placeholder={`Email ${index + 1}`}
                                    value={formik.values.emails[index]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className='flex-1'
                                />
                                <Remove
                                    disabled={formik.values.emails.length === 1}
                                    onClick={() =>
                                        handleArrayFieldChange(
                                            formik,
                                            'remove',
                                            'emails',
                                            index
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </InputWrapper>
                    <Add
                        label='Add Email'
                        onClick={() =>
                            handleArrayFieldChange(formik, 'add', 'emails')
                        }
                    />
                </div>

                {/* Contacts Field Array */}
                <div className='space-y-2'>
                    <InputWrapper
                        label='Contact Numbers'
                        error={formik.errors?.contacts}
                        touched={formik.touched?.contacts}
                    >
                        {formik.values.contacts.map((_, index) => (
                            <div
                                key={index}
                                className='flex gap-2 items-center'
                            >
                                <Input
                                    name={`contacts[${index}]`}
                                    placeholder={`Contact Number ${index + 1}`}
                                    value={formik.values.contacts[index]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className='flex-1'
                                />
                                <Remove
                                    disabled={
                                        formik.values.contacts.length === 1
                                    }
                                    onClick={() =>
                                        handleArrayFieldChange(
                                            formik,
                                            'remove',
                                            'contacts',
                                            index
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </InputWrapper>
                    <Add
                        label='Add Contact'
                        onClick={() =>
                            handleArrayFieldChange(formik, 'add', 'contacts')
                        }
                    />
                </div>

                {/* Social Links Field Array */}
                <div className='space-y-2'>
                    <InputWrapper
                        label='Social Links'
                        error={formik.errors?.socialLinks}
                        touched={formik.touched?.socialLinks}
                    >
                        {formik.values.socialLinks.map((_, index) => (
                            <div
                                key={index}
                                className='flex gap-2 items-center'
                            >
                                <Input
                                    name={`socialLinks[${index}]`}
                                    placeholder={`Social Link URL ${index + 1}`}
                                    value={formik.values.socialLinks[index]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className='flex-1'
                                />
                                <Remove
                                    disabled={
                                        formik.values.socialLinks.length === 1
                                    }
                                    onClick={() =>
                                        handleArrayFieldChange(
                                            formik,
                                            'remove',
                                            'socialLinks',
                                            index
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </InputWrapper>
                    <Add
                        label='Add Social Link'
                        onClick={() =>
                            handleArrayFieldChange(formik, 'add', 'socialLinks')
                        }
                    />
                </div>
            </div>

            <div className='flex items-center space-x-2'>
                {/* <Reset onClick={reset} /> */}
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
