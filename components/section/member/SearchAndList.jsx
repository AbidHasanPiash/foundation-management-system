'use client';

import { Input } from '@/components/ui/input';
import InputWrapper from '@/components/ui/input-wrapper';
import ComboboxFormik from '@/components/ui/ComboboxFormik';
import * as Yup from 'yup';
import { HiSearch } from 'react-icons/hi';
import { useFormik } from 'formik';
import { useState } from 'react';
import Submit from '@/components/button/Submit';
import Reset from '@/components/button/Reset';
import { fetchData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import { useMutation } from '@tanstack/react-query';
import Spinner from '@/components/common/Spinner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

export default function SearchAndList({ types }) {
    // State for search results
    const [searchResult, setSearchResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false);

    // Form Initial Values
    const initialValues = {
        typeId: '',
        memberId: '',
        name: '',
        email: '',
        phone: '',
        designation: '',
        nid: '',
    };

    // Validation Schema
    const validationSchema = Yup.object({
        typeId: Yup.lazy(() => {
            if (isAdvanceSearch) {
                return Yup.string().nullable();
            } else {
                return Yup.string().required('Member Type is required');
            }
        }),
        memberId: Yup.lazy(() => {
            if (isAdvanceSearch) {
                return Yup.string().nullable();
            } else {
                return Yup.string().required('Member Number is required');
            }
        }),
        name: Yup.string().nullable(),
        email: Yup.string().nullable().email('Invalid email address'),
        phone: Yup.string()
            .nullable()
            .matches(
                /^(?:\+?88)?01[3-9]\d{8}$/,
                'Invalid Bangladeshi phone number'
            ),
        designation: Yup.string().nullable(),
        nid: Yup.string().length(10, 'NID number must be exactly 10 digits'),
    });

    // Search Function
    const searchMember = async (params) => {
        try {
            const { typeId, memberId, email, name, phone, designation, nid } =
                params;

            const searchParams = new URLSearchParams();
            if (memberId) searchParams.append('memberId', memberId);
            if (name && isAdvanceSearch) searchParams.append('name', name);
            if (email && isAdvanceSearch) searchParams.append('email', email);
            if (phone && isAdvanceSearch) searchParams.append('phone', phone);
            if (designation && isAdvanceSearch)
                searchParams.append('designation', designation);
            if (nid && isAdvanceSearch) searchParams.append('nid', nid);

            const response = await fetchData(
                `${apiConfig?.GET_MEMBER_LIST}?${searchParams.toString()}`
            );

            if (response) {
                setSearchResult(response);
                setErrorMessage('');
            } else {
                setSearchResult(null);
                setErrorMessage('No member found with the given details.');
            }
        } catch (error) {
            console.error('Error searching for member:', error);
            setErrorMessage(
                'An error occurred while searching. Please try again.'
            );
            setSearchResult(null);
        }
    };

    // Reset Form
    const resetForm = () => {
        formik.resetForm();
        setSearchResult(null);
        setErrorMessage('');
    };

    // Formik Setup
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
        validateOnBlur: true,
        validateOnChange: true,
    });

    const mutation = useMutation({
        mutationKey: ['searchMember'],
        mutationFn: searchMember,
        // onSuccess: () => resetForm(),
    });

    return (
        <div className='w-full space-y-6'>
            <div className='flex items-end justify-end'>
                <div className='flex items-center space-x-2'>
                    <Switch
                        id='advanceSearch'
                        checked={isAdvanceSearch}
                        onCheckedChange={setIsAdvanceSearch}
                    />
                    <Label htmlFor='advanceSearch'>Advance Search</Label>
                </div>
            </div>
            {/* Search Form */}
            <form onSubmit={formik.handleSubmit} className='w-full space-y-4'>
                <div className='grid md:grid-cols-4 gap-4'>
                    {/* Member Type */}
                    <InputWrapper
                        label='Member Type'
                        error={formik.errors?.typeId}
                        touched={formik.touched?.typeId}
                    >
                        <ComboboxFormik
                            select='type'
                            display='type'
                            name='typeId'
                            formik={formik}
                            data={types}
                        />
                    </InputWrapper>

                    {/* Member Number */}
                    <InputWrapper
                        label='Member Number'
                        error={formik.errors?.memberId}
                        touched={formik.touched?.memberId}
                    >
                        <Input
                            name='memberId'
                            placeholder={
                                formik.values?.typeId
                                    ? `${formik.values.typeId.toLowerCase().slice(0, 3)}-XXXXX`
                                    : 'Enter member number'
                            }
                            value={formik.values?.memberId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>
                </div>

                {/* Email (Optional) */}
                {isAdvanceSearch && (
                    <div className='grid md:grid-cols-4 gap-4'>
                        <InputWrapper
                            label='Name'
                            error={formik.errors?.name}
                            touched={formik.touched?.name}
                        >
                            <Input
                                name='name'
                                placeholder='Enter name'
                                value={formik.values?.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </InputWrapper>

                        <InputWrapper
                            label='NID'
                            error={formik.errors?.nid}
                            touched={formik.touched?.nid}
                        >
                            <Input
                                name='nid'
                                type='number'
                                placeholder='Enter nid'
                                value={formik.values?.nid}
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
                                placeholder='Enter designation'
                                value={formik.values?.designation}
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
                                placeholder='Enter email'
                                value={formik.values?.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </InputWrapper>

                        <InputWrapper
                            label='Phone'
                            error={formik.errors?.phone}
                            touched={formik.touched?.phone}
                        >
                            <Input
                                name='phone'
                                placeholder='Enter phone'
                                value={formik.values?.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </InputWrapper>
                    </div>
                )}

                {/* Actions */}
                <div className='flex space-x-4'>
                    <Reset onClick={resetForm} />
                    <Submit
                        disabled={mutation.isPending}
                        label={mutation.isPending ? 'Searching...' : 'Search'} // Dynamic label
                        icon={
                            mutation.isPending ? (
                                <Spinner size='4' />
                            ) : (
                                <HiSearch />
                            )
                        } // Dynamic icon
                    />
                </div>
            </form>

            {/* Search Results */}
            <div className='min-h-[200px]'>
                {searchResult && <MemberProfile member={searchResult} />}
                {errorMessage && (
                    <div className='mt-4 p-4 border rounded bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'>
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

function MemberProfile({ member }) {
    if (!member) return null;

    return (
        <div className='p-6 bg-white dark:bg-gray-800 shadow rounded-lg'>
            <div className='flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6'>
                {/* Avatar Section */}
                <div className='flex-shrink-0'>
                    <img
                        className='w-24 h-24 rounded-full object-cover'
                        src={member.image?.link}
                        alt={`${member.name}'s Avatar`}
                    />
                </div>

                {/* Member Info Section */}
                <div className='flex-1'>
                    <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
                        {member.name}
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400'>
                        {member.designation} at {member.workplace}
                    </p>
                    <p className='text-gray-600 dark:text-gray-400'>
                        {member.email}
                    </p>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Phone: {member.phone}
                    </p>
                </div>
            </div>

            <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Address Section */}
                <div>
                    <h3 className='font-medium text-gray-800 dark:text-white'>
                        Current Address
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                        {`${member.currentAddress.village}, ${member.currentAddress.subdistrict}, ${member.currentAddress.district}`}
                    </p>
                </div>
                <div>
                    <h3 className='font-medium text-gray-800 dark:text-white'>
                        Permanent Address
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                        {`${member.permanentAddress.village}, ${member.permanentAddress.subdistrict}, ${member.permanentAddress.district}`}
                    </p>
                </div>

                {/* Additional Information */}
                <div>
                    <h3 className='font-medium text-gray-800 dark:text-white'>
                        Blood Group
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                        {member.bloodGroup}
                    </p>
                </div>
                <div>
                    <h3 className='font-medium text-gray-800 dark:text-white'>
                        Date of Birth
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                        {new Date(member.dob).toLocaleDateString()}
                    </p>
                </div>
                <div>
                    <h3 className='font-medium text-gray-800 dark:text-white'>
                        Member ID
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                        {member.memberId}
                    </p>
                </div>
                <div>
                    <h3 className='font-medium text-gray-800 dark:text-white'>
                        Status
                    </h3>
                    <Badge
                        variant={
                            member.statusId === 'active'
                                ? 'success'
                                : 'destructive'
                        }
                    >
                        {member.statusId === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
            </div>
        </div>
    );
}
