'use client';
import React from 'react';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import InputWrapper from '@/components/ui/input-wrapper';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import ComboboxFormik from '@/components/ui/ComboboxFormik';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { postData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';

export default function ScholarshipForm({ formDetails, organizationInfo }) {
    const formInfo = {
        slNo: formDetails?.slNo,
        organizer: {
            name: organizationInfo?.name,
            address: organizationInfo?.address,
            founded: new Date(organizationInfo?.startDate).getFullYear(),
        },
        formTitle: formDetails?.formTitle,
        formName: formDetails?.formName,
        venue: formDetails?.venue,
        eligibleSchools: formDetails?.eligibleSchools,
        exam: formDetails?.exam,
        note: formDetails?.note,
        contact: organizationInfo?.contacts,
        email: organizationInfo?.emails,
    };

    const currentDate = new Date().toISOString().split('T')[0];

    const initialValues = {
        applicantNameBn: '',
        applicantNameEn: '',
        fatherName: '',
        motherName: '',
        schoolName: '',
        classRollNo: null,
        contact: '',
        image: null,
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
    };

    const validationSchema = Yup.object().shape({
        applicantNameBn: Yup.string()
            .required('Applicant name (Bangla) is required')
            .matches(
                /^[\u0980-\u09FF\s]+$/,
                'Applicant name must be in Bangla'
            ),
        applicantNameEn: Yup.string().required(
            'Applicant name (English) is required'
        ),
        fatherName: Yup.string().required("Father's name is required"),
        motherName: Yup.string().required("Mother's name is required"),
        schoolName: Yup.string().required('School name is required'),
        classRollNo: Yup.string()
            .required('Class roll number is required')
            .matches(/^\d+$/, 'Class roll number must be a valid number'),
        contact: Yup.string()
            .required('Contact number is required')
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

    const submit = async (values) => {
        const formData = new FormData();

        const appendIfPresent = (key, value) => {
            if (value !== undefined && value !== null && value !== '') {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    for (const [subKey, subValue] of Object.entries(value)) {
                        appendIfPresent(`${key}[${subKey}]`, subValue);
                    }
                } else {
                    formData.append(key, value);
                }
            }
        };

        // Append simple fields
        appendIfPresent('applicantNameBn', values.applicantNameBn);
        appendIfPresent('applicantNameEn', values.applicantNameEn);
        appendIfPresent('fatherName', values.fatherName);
        appendIfPresent('motherName', values.motherName);
        appendIfPresent('schoolName', values.schoolName);
        appendIfPresent('classRollNo', values.classRollNo);
        appendIfPresent('contact', values.contact);

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

        // Append image
        if (values.image) {
            formData.append('image', values.image);
        }

        await postData(`${apiConfig?.SUBMIT_SCHOLARSHIP_FORM}${formDetails?._id}/data`, formData);
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
        mutationKey: ['scholarship'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <div className='w-full space-y-10'>
            <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
                <div className='flex flex-col items-center justify-center text-base'>
                    <p className='text-xl md:text-2xl text-primary uppercase font-bold'>
                        {formInfo?.organizer?.name}
                    </p>
                    <p className=''>{formInfo?.organizer?.address}</p>
                    <p className='font-bold'>
                        Since - {formInfo?.organizer?.founded}
                    </p>
                    <p className='text-lg md:text-xl font-bold'>
                        {formInfo?.formTitle}
                    </p>
                    <p className='text-sm md:text-lg border-4 mt-2 border-double p-1 w-fit'>
                        {formInfo?.formName}
                    </p>
                </div>

                <div className='flex items-center justify-between'>
                    <div>
                        <p>Date: {currentDate}</p>
                        <p>SL No: {formInfo?.slNo}</p>
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
                </div>

                <div className='grid gap-2 md:grid-cols-2 w-full'>
                    <InputWrapper
                        label='Applicant Name Bangla'
                        error={formik.errors.applicantNameBn}
                        touched={formik.touched.applicantNameBn}
                    >
                        <Input
                            name='applicantNameBn'
                            placeholder='Applicant Name Bangla'
                            value={formik.values.applicantNameBn}
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
                        label='Applicant Name English'
                        error={formik.errors.applicantNameEn}
                        touched={formik.touched.applicantNameEn}
                    >
                        <Input
                            name='applicantNameEn'
                            placeholder='Applicant Name English'
                            value={formik.values.applicantNameEn}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label='Father / Mother Phone Number'
                        error={formik.errors.contact}
                        touched={formik.touched.contact}
                    >
                        <Input
                            name='contact'
                            placeholder='Phone'
                            value={formik.values.contact}
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
                        label='School Name'
                        error={formik.errors?.schoolName}
                        touched={formik.touched?.schoolName}
                    >
                        <ComboboxFormik
                            select='_id'
                            display='name'
                            name='schoolName'
                            formik={formik}
                            data={formInfo?.eligibleSchools}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label='Class Roll No'
                        error={formik.errors.classRollNo}
                        touched={formik.touched.classRollNo}
                    >
                        <Input
                            type='number'
                            name='classRollNo'
                            placeholder='Class Roll No'
                            value={formik.values.classRollNo}
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

            <Card>
                <CardHeader>
                    <p className='text-center text-lg md:text-xl font-bold'>Exam Details</p>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption> Venue : {formInfo?.venue} </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-10'>SL</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formInfo?.exam.map((exam, index) => (
                                <TableRow key={index}>
                                    <TableCell className='w-10'>{index + 1}</TableCell>
                                    <TableCell className="font-medium">{exam.subject}</TableCell>
                                    <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{exam.time}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className='w-full flex flex-col items-start gap-2'>
                    <div className='flex items-baseline gap-2'>
                        <p className='text-center text-sm md:text-lg font-medium'>Note: </p>
                        {formInfo?.note?.map((note, index) => (
                            <p key={index} className='text-justify'>*{note},</p>
                        ))}
                    </div>
                    <div className='flex items-baseline gap-2'>
                        <p className='text-center text-sm md:text-lg font-medium'>Contact: </p>
                        {formInfo?.contact?.map((contact, index) => (
                            <p key={index} className='text-justify'>{contact},</p>
                        ))}
                    </div>
                    <div className='flex items-baseline gap-2'>
                        <p className='text-center text-sm md:text-lg font-medium'>Email: </p>
                        {formInfo?.email?.map((email, index) => (
                            <p key={index} className='text-justify'>{email},</p>
                        ))}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
