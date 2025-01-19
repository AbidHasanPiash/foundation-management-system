'use client';

import InputWrapper from '@/components/ui/input-wrapper';
import ComboboxFormik from '@/components/ui/ComboboxFormik';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { handleArrayFieldChange } from '@/util/formikHelpers';
import { fetchData, postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import { Textarea } from '@/components/ui/textarea';
import Remove from '@/components/button/Remove';
import Add from '@/components/button/Add';

export default function EventBudgetForm({ data }) {
    const initialValues = {
        eventId: data?.eventId || '',
        description: data?.description || '',
        budget: data?.budget || [
            {
                purpose: '',
                note: '',
                paymentDetails: '',
                budgetAmount: null,
            },
        ],
    };

    const validationSchema = Yup.object().shape({
        eventId: Yup.string().required('Please select an event'),
        description: Yup.string()
            .min(10, 'Description must be at least 10 characters')
            .max(500, 'Description must not exceed 500 characters')
            .required('Description is required'),
        budget: Yup.array()
            .of(
                Yup.object().shape({
                    purpose: Yup.string().required('Purpose is required'),
                    note: Yup.string()
                        .max(200, 'Note must not exceed 200 characters')
                        .nullable(),
                    paymentDetails: Yup.string()
                        .max(
                            200,
                            'Payment details must not exceed 200 characters'
                        )
                        .nullable(),
                    budgetAmount: Yup.number()
                        .typeError('Budget amount must be a number')
                        .positive('Budget amount must be positive')
                        .required('Budget amount is required'),
                })
            )
            .min(1, 'At least one budget entry is required')
            .required('Budget is required'),
    });

    const submit = async (values) => {
        if (data) {
            await updateData(apiConfig?.UPDATE_BUDGET + data?._id, values);
        } else {
            await postData(apiConfig?.CREATE_BUDGET, values);
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
        mutationKey: ['event-budget'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    const { isLoading: eventLoading, data: event } = useQuery({
        queryKey: ['events'],
        queryFn: async () => await fetchData(apiConfig?.GET_EVENT),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid gap-2 w-full'>
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
                    label='Description'
                    error={formik.errors?.description}
                    touched={formik.touched?.description}
                >
                    <Textarea
                        name='description'
                        placeholder='Description of the Budget'
                        rows={3}
                        value={formik.values?.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <div className='space-y-2'>
                    <label>Budget</label>
                    {formik.values.budget.map((_, index) => (
                        <div key={index} className='flex gap-2 items-center'>
                            <InputWrapper
                                error={formik.errors?.budget?.[index]?.purpose}
                                touched={
                                    formik.touched?.budget?.[index]?.purpose
                                }
                                className='flex-1'
                            >
                                <Input
                                    name={`budget[${index}].purpose`}
                                    placeholder={`Budget purpose ${index + 1}`}
                                    value={formik.values.budget[index].purpose}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </InputWrapper>
                            <InputWrapper
                                error={formik.errors?.budget?.[index]?.note}
                                touched={formik.touched?.budget?.[index]?.note}
                                className='flex-1'
                            >
                                <Input
                                    name={`budget[${index}].note`}
                                    placeholder={`Budget note ${index + 1}`}
                                    value={formik.values.budget[index].note}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </InputWrapper>
                            <InputWrapper
                                error={
                                    formik.errors?.budget?.[index]
                                        ?.paymentDetails
                                }
                                touched={
                                    formik.touched?.budget?.[index]
                                        ?.paymentDetails
                                }
                                className='flex-1'
                            >
                                <Input
                                    name={`budget[${index}].paymentDetails`}
                                    placeholder={`Budget paymentDetails ${index + 1}`}
                                    value={
                                        formik.values.budget[index]
                                            .paymentDetails
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </InputWrapper>
                            <InputWrapper
                                error={
                                    formik.errors?.budget?.[index]?.budgetAmount
                                }
                                touched={
                                    formik.touched?.budget?.[index]
                                        ?.budgetAmount
                                }
                                className='flex-1'
                            >
                                <Input
                                    type='number'
                                    name={`budget[${index}].budgetAmount`}
                                    placeholder={`Budget budgetAmount ${index + 1}`}
                                    value={
                                        formik.values.budget[index].budgetAmount
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </InputWrapper>
                            <Remove
                                disabled={formik.values.budget.length === 1}
                                onClick={() =>
                                    handleArrayFieldChange(
                                        formik,
                                        'remove',
                                        'budget',
                                        index
                                    )
                                }
                            />
                        </div>
                    ))}
                    <Add
                        label='Add another'
                        onClick={() =>
                            handleArrayFieldChange(formik, 'add', 'budget')
                        }
                    />
                </div>
            </div>

            <div className='flex items-center space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
