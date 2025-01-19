'use client';

import InputWrapper from '@/components/ui/input-wrapper';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { handleArrayFieldChange } from '@/util/formikHelpers';
import { postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import { Textarea } from '@/components/ui/textarea';
import Remove from '@/components/button/Remove';
import Add from '@/components/button/Add';
import { Label } from '@/components/ui/label';

export default function EventBudgetCostingForm({ data }) {
    const initialValues = {
        description: data?.description || '',
        budget: data?.budget || [
            {
                purpose: '',
                note: '',
                paymentDetails: '',
                budgetAmount: null,
                actualAmount: null,
            },
        ],
    };

    const validationSchema = Yup.object().shape({
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
                    actualAmount: Yup.number()
                        .typeError('Actual amount must be a number')
                        .min(0, 'Actual amount must be at least 0')
                        .required('Actual amount is required'),
                })
            )
            .min(1, 'At least one budget entry is required')
            .required('Budget is required'),
    });

    const submit = async (values) => {
        await updateData(apiConfig?.UPDATE_BUDGET_COSTING + data?._id, values);
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

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid gap-2 w-full'>
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
                                <p className='text-xs'>{`Purpose ${index + 1}`}</p>
                                <Input
                                    name={`budget[${index}].purpose`}
                                    placeholder={`Budget purpose ${index + 1}`}
                                    value={formik.values.budget[index].purpose}
                                    disabled
                                    // onChange={formik.handleChange}
                                    // onBlur={formik.handleBlur}
                                />
                            </InputWrapper>
                            <InputWrapper
                                error={formik.errors?.budget?.[index]?.note}
                                touched={formik.touched?.budget?.[index]?.note}
                                className='flex-1'
                            >
                                <p className='text-xs'>{`Note ${index + 1}`}</p>
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
                                <p className='text-xs'>{`Payment details ${index + 1}`}</p>
                                <Input
                                    name={`budget[${index}].paymentDetails`}
                                    placeholder={`Budget paymentDetails ${index + 1}`}
                                    value={
                                        formik.values.budget[index]
                                            .paymentDetails
                                    }
                                    disabled
                                    // onChange={formik.handleChange}
                                    // onBlur={formik.handleBlur}
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
                                <p className='text-xs'>{`Budget amount ${index + 1}`}</p>
                                <Input
                                    type='number'
                                    name={`budget[${index}].budgetAmount`}
                                    placeholder={`Budget budgetAmount ${index + 1}`}
                                    value={
                                        formik.values.budget[index].budgetAmount
                                    }
                                    disabled
                                    // onChange={formik.handleChange}
                                    // onBlur={formik.handleBlur}
                                />
                            </InputWrapper>
                            <InputWrapper
                                error={
                                    formik.errors?.budget?.[index]?.actualAmount
                                }
                                touched={
                                    formik.touched?.budget?.[index]
                                        ?.actualAmount
                                }
                                className='flex-1'
                            >
                                <p className='text-xs'>{`Actual amount ${index + 1}`}</p>
                                <Input
                                    type='number'
                                    name={`budget[${index}].actualAmount`}
                                    placeholder={`Budget budgetAmount ${index + 1}`}
                                    value={
                                        formik.values.budget[index].actualAmount
                                    }
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </InputWrapper>
                            {/* <Remove
                                disabled={formik.values.budget.length === 1}
                                onClick={() => handleArrayFieldChange(formik, 'remove', 'budget', index)}
                            /> */}
                        </div>
                    ))}
                    {/* <Add label='Add another' onClick={() => handleArrayFieldChange(formik, 'add', 'budget')} /> */}
                </div>
            </div>

            <div className='flex items-center space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
