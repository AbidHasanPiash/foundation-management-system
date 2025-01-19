'use client';
import React from 'react';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import InputWrapper from '@/components/ui/input-wrapper';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { InputNumber } from '@/components/ui/Input-number';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    clearField,
    handleCheckboxChange,
    handleImageChange,
} from '@/util/formikHelpers';
import { GoX } from 'react-icons/go';
import { Button } from '@/components/ui/button';
import { fetchData, postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import ComboboxFormik from '../ui/ComboboxFormik';

export default function MembershipForm({ data }) {
    const currentDate = new Date().toISOString().split('T')[0];

    const initialValues = {
        memberId: data?.memberId || '',
        name: data?.name || '',
        email: data?.email || '',
        phone: data?.phone || '',
        image: '',
        nid: data?.nid || '',
        joinDate: data?.joinDate?.split('T')[0] || '',
        educationalBackground: data?.educationalBackground || '',
        occupation: data?.occupation || '',
        workplace: data?.workplace || '',
        designation: data?.designation || '',
        bloodGroup: data?.bloodGroup || '',
        dob: data?.dob?.split('T')[0] || '',
        fatherName: data?.fatherName || '',
        spouseName: data?.spouseName || '',
        motherName: data?.motherName || '',
        permanentAddress: data?.permanentAddress || {
            village: '',
            postOffice: '',
            subdistrict: '',
            district: '',
        },
        isCurrentAddressSameAsPermanentAddress:
            data?.isCurrentAddressSameAsPermanentAddress || false,
        currentAddress: data?.currentAddress || {
            village: '',
            postOffice: '',
            subdistrict: '',
            district: '',
        },
        typeId: data?.typeId || '',
        statusId: data?.statusId || '',
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
        image: Yup.lazy((value, { parent }) => {
            if (parent?.image || data?.image) {
                // If there's already a banner, no validation is needed
                return Yup.mixed();
            } else {
                // Validate banner as required and check file type
                return Yup.mixed()
                    .required('Image is required')
                    .test(
                        'fileType',
                        'Unsupported file format. Only images are allowed',
                        (value) =>
                            !value ||
                            [
                                'image/jpeg',
                                'image/jpg',
                                'image/png',
                                'image/gif',
                            ].includes(value?.type)
                    );
            }
        }),
        nid: Yup.string()
            .length(10, 'NID number must be exactly 10 digits')
            .required('NID number is required'),
        joinDate: Yup.date()
            .required('Join date is required')
            .max(new Date(), 'Join date cannot be in the future'),
        educationalBackground: Yup.string().required(
            'Educational background is required'
        ),
        occupation: Yup.string().required('Occupation is required'),
        workplace: Yup.string().required('Workplace is required'),
        designation: Yup.string().required('Designation is required'),
        bloodGroup: Yup.string()
            .oneOf(
                ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
                'Invalid blood group'
            )
            .required('Blood group is required'),
        dob: Yup.date()
            .required('Date of birth is required')
            .max(new Date(), 'Date of birth cannot be in the future'),
        fatherName: Yup.string().required("Father's name is required"),
        spouseName: Yup.string(),
        motherName: Yup.string().required("Mother's name is required"),
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
        typeId: Yup.string().required('Please select a team type'),
        statusId: Yup.string().required('Please select a status'),
    });

    const submit = async (values) => {
        const formData = new FormData();

        // Helper function to append only non-empty values
        const appendIfPresent = (key, value) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value);
            }
        };

        // Append basic fields
        appendIfPresent('memberId', values.memberId);
        appendIfPresent('name', values.name);
        appendIfPresent('email', values.email);
        appendIfPresent('phone', values.phone);
        appendIfPresent('image', values.image);
        appendIfPresent('nid', values.nid);
        appendIfPresent('joinDate', values.joinDate);
        appendIfPresent('educationalBackground', values.educationalBackground);
        appendIfPresent('occupation', values.occupation);
        appendIfPresent('workplace', values.workplace);
        appendIfPresent('designation', values.designation);
        appendIfPresent('bloodGroup', values.bloodGroup);
        appendIfPresent('dob', values.dob);
        appendIfPresent('fatherName', values.fatherName);
        appendIfPresent('spouseName', values.spouseName);
        appendIfPresent('motherName', values.motherName);
        appendIfPresent(
            'isCurrentAddressSameAsPermanentAddress',
            values.isCurrentAddressSameAsPermanentAddress
        );
        appendIfPresent('typeId', values.typeId);
        appendIfPresent('statusId', values.statusId);

        // Append nested permanentAddress fields
        Object.keys(values.permanentAddress).forEach((key) => {
            appendIfPresent(
                `permanentAddress.${key}`,
                values.permanentAddress[key]
            );
        });

        // Append nested currentAddress fields if addresses are different
        if (!values.isCurrentAddressSameAsPermanentAddress) {
            Object.keys(values.currentAddress).forEach((key) => {
                appendIfPresent(
                    `currentAddress.${key}`,
                    values.currentAddress[key]
                );
            });
        }

        if (data) {
            await updateData(apiConfig?.UPDATE_MEMBER, formData);
        } else {
            await postData(apiConfig?.CREATE_MEMBER, formData);
        }
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
        mutationKey: ['membership'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    const { isLoading: memberTypeLoading, data: memberType } = useQuery({
        queryKey: ['member-type'],
        queryFn: async () => await fetchData(apiConfig?.GET_MEMBER_TYPE),
    });

    const { isLoading: memberStatusLoading, data: memberStatus } = useQuery({
        queryKey: ['member-status'],
        queryFn: async () => await fetchData(apiConfig?.GET_MEMBER_STATUS),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid gap-2 md:grid-cols-2 w-full'>
                <div>
                    <p>
                        {data ? 'Edit' : 'Create '} Date: {currentDate}
                    </p>
                    <p>
                        Member ID:{' '}
                        {formik?.values?.memberId && formik?.values?.memberId}
                    </p>
                </div>
                <div>
                    {(formik?.values?.image || data?.image) && (
                        <div className='flex items-center justify-end relative'>
                            <img
                                src={
                                    data?.image ||
                                    URL.createObjectURL(formik.values.image)
                                }
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
                    label='Member Type'
                    error={formik.errors?.typeId}
                    touched={formik.touched?.typeId}
                >
                    <ComboboxFormik
                        select='_id'
                        display='type'
                        name='typeId'
                        formik={formik}
                        data={memberType}
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
                        data={memberStatus}
                    />
                </InputWrapper>

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
                        placeholder='e.g., A+, O-, AB+'
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
                    label='Spouse Name'
                    error={formik.errors.spouseName}
                    touched={formik.touched.spouseName}
                >
                    <Input
                        name='spouseName'
                        placeholder='Spouse Name'
                        value={formik.values.spouseName}
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
                    hidden={!!data}
                    label='NID Number'
                    error={formik.errors.nid}
                    touched={formik.touched.nid}
                    className={'md:col-span-2'}
                >
                    <InputNumber
                        value={formik.values.nid}
                        onChange={(value) => formik.setFieldValue('nid', value)}
                        onBlur={formik.handleBlur}
                        totalDigits={10}
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
