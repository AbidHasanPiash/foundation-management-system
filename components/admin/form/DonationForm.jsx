'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import ComboboxFormik from '@/components/ui/ComboboxFormik';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { Checkbox } from '@/components/ui/checkbox';
import { handleCheckboxChange } from '@/util/formikHelpers';
import { fetchData, postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import { Textarea } from '@/components/ui/textarea';
import donationConstants from '@/app/api/v1/finance/donation/donation.constants';

export default function DonationForm({ data }) {
    const donationType = donationConstants.allowedDonationTypes.map((type) => ({
        type,
        name: type
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalize each word
    }));
    const initialValues = {
        donationType: data?.donationType || '',
        memberId: data?.memberId || '',
        eventId: data?.eventId || '',
        amount: data?.amount || null,
        paymentMethodId: data?.paymentMethodId || '',
        hasBankDetails: data?.hasBankDetails || false,
        bankDetails: data?.bankDetails || {
            bankName: '',
            branchName: '',
        },
        description: data?.description || '',
        collectedBy: data?.collectedBy || '',
    };

    const validationSchema = Yup.object({
        donationType: Yup.string().required('Required field'),
        amount: Yup.number()
            .required('Amount is required field')
            .min(1, 'Amount must be positive'),
        // memberId: Yup.string().required('Required field'),
        memberId: Yup.lazy((currentAddress, { parent }) => {
            // `parent` allows access to sibling values in validation context
            if (
                parent.donationType === 'event_fee' ||
                parent.donationType === 'monthly_fee'
            ) {
                return Yup.string().required(
                    'Member ID is required for event fee and monthly donations'
                );
            } else {
                return Yup.string().nullable();
            }
        }),
        eventId: Yup.lazy((currentAddress, { parent }) => {
            // `parent` allows access to sibling values in validation context
            if (parent.donationType === 'event_fee') {
                return Yup.string().required(
                    'Event ID is required for event fee donations'
                );
            } else {
                return Yup.string().nullable();
            }
        }),
        paymentMethodId: Yup.string().required(
            'Payment method is required field'
        ),
        hasBankDetails: Yup.boolean(),
        bankDetails: Yup.lazy((currentAddress, { parent }) => {
            // `parent` allows access to sibling values in validation context
            if (parent.hasBackDetails) {
                return Yup.object().shape({
                    bankName: Yup.string().required('Bank name is required'),
                    branchName: Yup.string().required(
                        'Branch name is required'
                    ),
                });
            } else {
                return Yup.object().shape({
                    bankName: Yup.string().nullable(),
                    branchName: Yup.string().nullable(),
                });
            }
        }),
    });

    const submit = async (values) => {
        if (data) {
            await updateData(apiConfig?.UPDATE_DONATION + data?._id, values);
        } else {
            await postData(apiConfig?.CREATE_DONATION, values);
        }
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
        mutationKey: ['donation'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    const { isLoading: memberLoading, data: member } = useQuery({
        queryKey: ['member'],
        queryFn: async () => await fetchData(apiConfig?.GET_MEMBER_LIST),
    });

    const { isLoading: methodLoading, data: method } = useQuery({
        queryKey: ['payment-method'],
        queryFn: async () => await fetchData(apiConfig?.GET_PAYMENT_METHOD),
    });

    const { isLoading: eventLoading, data: event } = useQuery({
        queryKey: ['event'],
        queryFn: async () => await fetchData(apiConfig?.GET_EVENT),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-3 gap-2 w-full'>
                <InputWrapper
                    label='Donation Type'
                    error={formik.errors?.donationType}
                    touched={formik.touched?.donationType}
                >
                    <ComboboxFormik
                        select='type'
                        display='name'
                        name='donationType'
                        formik={formik}
                        data={donationType}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Donor Name'
                    error={formik.errors?.memberId}
                    touched={formik.touched?.memberId}
                >
                    <ComboboxFormik
                        select='_id'
                        display='name'
                        name='memberId'
                        formik={formik}
                        data={member}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Event'
                    error={formik.errors?.eventId}
                    touched={formik.touched?.eventId}
                >
                    <ComboboxFormik
                        select='_id'
                        display='title'
                        name='eventId'
                        formik={formik}
                        data={event}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Amount'
                    error={formik.errors?.amount}
                    touched={formik.touched?.amount}
                >
                    <Input
                        name='amount'
                        type='number'
                        placeholder='Donation Amount'
                        value={formik.values?.amount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Payment Method'
                    error={formik.errors?.paymentMethodId}
                    touched={formik.touched?.paymentMethodId}
                >
                    <ComboboxFormik
                        select='_id'
                        display='type'
                        name='paymentMethodId'
                        formik={formik}
                        data={method}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Collected By'
                    error={formik.errors?.collectedBy}
                    touched={formik.touched?.collectedBy}
                >
                    <ComboboxFormik
                        select='_id'
                        display='name'
                        name='collectedBy'
                        formik={formik}
                        data={member}
                    />
                </InputWrapper>

                <InputWrapper
                    error={formik.errors?.description}
                    touched={formik.touched?.description}
                    className={'md:col-span-3'}
                >
                    <Textarea
                        name='description'
                        placeholder='Description'
                        value={formik.values?.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
            </div>

            <label className='w-fit flex items-center space-x-2'>
                <span>Has bank details</span>
                <Checkbox
                    checked={formik.values.hasBankDetails}
                    onCheckedChange={handleCheckboxChange(
                        formik,
                        'hasBankDetails'
                    )}
                />
            </label>

            {formik.values.hasBankDetails && (
                <>
                    <div className='grid gap-2 md:grid-cols-2'>
                        {['bankName', 'branchName'].map((field) => (
                            <InputWrapper
                                key={field}
                                label={
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                }
                                error={formik.errors?.bankDetails?.[field]}
                                touched={formik.touched?.bankDetails?.[field]}
                            >
                                <Input
                                    name={`bankDetails.${field}`}
                                    placeholder={
                                        field.charAt(0).toUpperCase() +
                                        field.slice(1)
                                    }
                                    value={formik.values.bankDetails[field]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </InputWrapper>
                        ))}
                    </div>
                </>
            )}

            <div className='flex items-center space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
