'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import { Input } from '@/components/ui/input';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import * as Yup from 'yup';
import Submit from '@/components/button/Submit';
import { useMutation } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { postData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import Spinner from '../common/Spinner';
import { RiSendPlaneLine } from 'react-icons/ri';

export default function ContactForm() {
    const initialValues = {
        name: '',
        email: '',
        subject: '',
        message: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required field'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        subject: Yup.string().required('Required field'),
        message: Yup.string().required('Required field'),
    });

    const submit = async (data) => {
        // toast.success(JSON.stringify(data));
        await postData(apiConfig?.CONTACT, data);
    };

    const reset = () => {
        formik?.resetForm();
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
    });

    const mutation = useMutation({
        mutationKey: ['contact'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });
    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid gap-2 w-full'>
                <div className='md:flex gap-2'>
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
                        label='Email'
                        error={formik.errors?.email}
                        touched={formik.touched?.email}
                    >
                        <Input
                            name='email'
                            type='email'
                            placeholder='Email'
                            value={formik.values?.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>
                </div>

                <InputWrapper
                    label='Subject'
                    error={formik.errors?.subject}
                    touched={formik.touched?.subject}
                >
                    <Input
                        name='subject'
                        placeholder='Subject'
                        value={formik.values?.subject}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Message'
                    error={formik.errors?.message}
                    touched={formik.touched?.message}
                >
                    <Textarea
                        name='message'
                        placeholder='Your Message'
                        rows={4}
                        value={formik.values?.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
            </div>

            <div className='flex items-center space-x-2'>
                {/* <Reset onClick={reset} /> */}
                <Submit
                    disabled={mutation.isPending}
                    label={mutation.isPending ? 'Submitting...' : 'Submit'} // Dynamic label
                    icon={
                        mutation.isPending ? (
                            <Spinner size='4' />
                        ) : (
                            <RiSendPlaneLine />
                        )
                    } // Dynamic icon
                />
            </div>
        </form>
    );
}
