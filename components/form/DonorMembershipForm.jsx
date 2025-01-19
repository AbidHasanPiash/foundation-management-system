'use client';
import React from 'react';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import InputWrapper from '@/components/ui/input-wrapper';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { InputNumber } from '@/components/ui/Input-number';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import * as Yup from 'yup';
import {
    clearField,
    handleCheckboxChange,
    handleImageChange,
} from '@/util/formikHelpers';
import { Button } from '@/components/ui/button';
import { GoX } from 'react-icons/go';

export default function DonorMembershipForm() {
    const currentDate = new Date().toISOString().split('T')[0];

    const initialValues = {
        memberId: '',
        name: '',
        email: '',
        phone: '',
        image: null,
        nid: '',
        educationalBackground: '',
        occupation: '',
        workplace: '',
        designation: '',
        bloodGroup: '',
        dob: '',
        fatherName: '',
        husbandName: '',
        motherName: '',
        permanentAddress: {
            village: '',
            postOffice: '',
            subdistrict: '',
            district: '',
        },
        isCurrentAddressSameAsPermanentAddress: false,
        currentAddress: {
            village: '',
            postOffice: '',
            subdistrict: '',
            district: '',
        },
        initialDonation: null,
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required field'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        phone: Yup.string()
            .required('Phone is required')
            .matches(
                /^(?:\+88|88)?01[3-9]\d{8}$/,
                'Invalid Bangladeshi phone number'
            ),
        image: Yup.mixed()
            .required('Image is required')
            .test('fileType', 'Only image files are allowed', (value) => {
                return (
                    value &&
                    ['image/jpeg', 'image/png', 'image/jpg'].includes(
                        value.type
                    )
                );
            }),
        nid: Yup.string()
            .length(10, 'NID number must be exactly 10 digits')
            .required('NID number is required'),
        educationalBackground: Yup.string().required(
            'Educational background is required'
        ),
        occupation: Yup.string().required('Occupation is required'),
        workplace: Yup.string(),
        designation: Yup.string(),
        bloodGroup: Yup.string(),
        dob: Yup.date().required('Date of birth is required'),
        fatherName: Yup.string().required("Father's name is required"),
        husbandName: Yup.string(),
        motherName: Yup.string().required("Mother's name is required"),
        initialDonation: Yup.number().required('Initial Donation is required'),
        permanentAddress: Yup.object().shape({
            village: Yup.string().required('Village is required'),
            postOffice: Yup.string().required('Post office is required'),
            subdistrict: Yup.string().required('Subdistrict is required'),
            district: Yup.string().required('District is required'),
        }),
        isCurrentAddressSameAsPermanentAddress: Yup.boolean(),
        currentAddress: Yup.lazy((currentAddress, { parent }) => {
            // `parent` allows access to sibling values in validation context
            if (parent.isCurrentAddressSameAsPermanentAddress) {
                return Yup.object().shape({
                    village: Yup.string().nullable(),
                    postOffice: Yup.string().nullable(),
                    subdistrict: Yup.string().nullable(),
                    district: Yup.string().nullable(),
                });
            } else {
                return Yup.object().shape({
                    village: Yup.string().required('Village is required'),
                    postOffice: Yup.string().required(
                        'Post office is required'
                    ),
                    subdistrict: Yup.string().required(
                        'Subdistrict is required'
                    ),
                    district: Yup.string().required('District is required'),
                });
            }
        }),
    });

    const submit = (data) => {
        toast.success(JSON.stringify(data));
    };

    const reset = () => {
        formik.resetForm();
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
    });

    const mutation = useMutation({
        mutationKey: ['donorMembership'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid gap-2 md:grid-cols-2 w-full'>
                <div>
                    <p>Date: {currentDate}</p>
                    <p>
                        Member ID:{' '}
                        {formik?.values?.memberId && formik?.values?.memberId}
                    </p>
                </div>
                <div>
                    {formik?.values?.image && (
                        <div className='flex items-center justify-end relative'>
                            <img
                                src={URL.createObjectURL(formik.values.image)}
                                alt='Selected Image'
                                className='w-24 h-24 object-cover border border-dashed rounded-md p-1'
                            />
                            <Button
                                type='button'
                                size='icon'
                                onClick={() => clearField(formik, 'image')}
                                className='absolute -top-1 -right-1 w-6 h-6 bg-rose-500 hover:bg-rose-600 rounded-full'
                            >
                                <GoX />
                            </Button>
                        </div>
                    )}
                </div>

                <InputWrapper
                    label='Name'
                    error={formik.errors.name}
                    touched={formik.touched.name}
                >
                    <Input
                        name='name'
                        placeholder='Your Name'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Image'
                    error={formik.errors.image}
                    touched={formik.touched.image}
                >
                    <Input
                        name='image'
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange(formik, 'image')}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Email'
                    error={formik.errors.email}
                    touched={formik.touched.email}
                >
                    <Input
                        name='email'
                        type='email'
                        placeholder='Email'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Phone'
                    error={formik.errors.phone}
                    touched={formik.touched.phone}
                >
                    <Input
                        name='phone'
                        placeholder='Phone'
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Educational Background'
                    error={formik.errors.educationalBackground}
                    touched={formik.touched.educationalBackground}
                >
                    <Input
                        name='educationalBackground'
                        placeholder='Educational Background'
                        value={formik.values.educationalBackground}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Occupation'
                    error={formik.errors.occupation}
                    touched={formik.touched.occupation}
                >
                    <Input
                        name='occupation'
                        placeholder='Occupation'
                        value={formik.values.occupation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Workplace'
                    error={formik.errors.workplace}
                    touched={formik.touched.workplace}
                >
                    <Input
                        name='workplace'
                        placeholder='Workplace'
                        value={formik.values.workplace}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Designation'
                    error={formik.errors.designation}
                    touched={formik.touched.designation}
                >
                    <Input
                        name='designation'
                        placeholder='Designation'
                        value={formik.values.designation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Blood Group'
                    error={formik.errors.bloodGroup}
                    touched={formik.touched.bloodGroup}
                >
                    <Input
                        name='bloodGroup'
                        placeholder='Blood Group'
                        value={formik.values.bloodGroup}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label="Father's Name"
                    error={formik.errors.fatherName}
                    touched={formik.touched.fatherName}
                >
                    <Input
                        name='fatherName'
                        placeholder="Father's Name"
                        value={formik.values.fatherName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label="Husband's Name"
                    error={formik.errors.husbandName}
                    touched={formik.touched.husbandName}
                >
                    <Input
                        name='husbandName'
                        placeholder="Husband's Name"
                        value={formik.values.husbandName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label="Mother's Name"
                    error={formik.errors.motherName}
                    touched={formik.touched.motherName}
                >
                    <Input
                        name='motherName'
                        placeholder="Mother's Name"
                        value={formik.values.motherName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Date of Birth'
                    error={formik.errors.dob}
                    touched={formik.touched.dob}
                >
                    <Input
                        name='dob'
                        type='date'
                        placeholder='Date of Birth'
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='NID Number'
                    error={formik.errors.nid}
                    touched={formik.touched.nid}
                >
                    <InputNumber
                        value={formik.values.nid}
                        onChange={(value) => formik.setFieldValue('nid', value)}
                        onBlur={formik.handleBlur}
                        totalDigits={10}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Initial Donation'
                    error={formik.errors.initialDonation}
                    touched={formik.touched.initialDonation}
                >
                    <Input
                        name='initialDonation'
                        type='number'
                        placeholder='Initial Donation'
                        value={formik.values.initialDonation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
            </div>

            {/* Permanent Address */}
            <h2 className='font-bold text-lg md:text-xl'>Permanent Address</h2>
            <div className='grid gap-2 md:grid-cols-2'>
                {['village', 'postOffice', 'subdistrict', 'district'].map(
                    (field) => (
                        <InputWrapper
                            key={field}
                            label={
                                field.charAt(0).toUpperCase() + field.slice(1)
                            }
                            error={formik.errors?.permanentAddress?.[field]}
                            touched={formik.touched?.permanentAddress?.[field]}
                        >
                            <Input
                                name={`permanentAddress.${field}`}
                                placeholder={
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                }
                                value={formik.values.permanentAddress[field]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </InputWrapper>
                    )
                )}
            </div>

            {/* Checkbox for current address */}
            <div className='flex items-center space-x-10'>
                <h2 className='font-bold text-lg md:text-xl'>
                    Current Address
                </h2>
                <label className='flex items-center space-x-2'>
                    <Checkbox
                        checked={
                            formik.values.isCurrentAddressSameAsPermanentAddress
                        }
                        onCheckedChange={handleCheckboxChange(
                            formik,
                            'isCurrentAddressSameAsPermanentAddress'
                        )}
                    />
                    <span>Same as Permanent Address</span>
                </label>
            </div>

            {/* Current Address */}
            {!formik.values.isCurrentAddressSameAsPermanentAddress && (
                <>
                    <div className='grid gap-2 md:grid-cols-2'>
                        {[
                            'village',
                            'postOffice',
                            'subdistrict',
                            'district',
                        ].map((field) => (
                            <InputWrapper
                                key={field}
                                label={
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                }
                                error={formik.errors?.currentAddress?.[field]}
                                touched={
                                    formik.touched?.currentAddress?.[field]
                                }
                            >
                                <Input
                                    name={`currentAddress.${field}`}
                                    placeholder={
                                        field.charAt(0).toUpperCase() +
                                        field.slice(1)
                                    }
                                    value={formik.values.currentAddress[field]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </InputWrapper>
                        ))}
                    </div>
                </>
            )}

            <div className='flex items-center justify-end space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending || mutation.isSuccess} />
            </div>
        </form>
    );
}
