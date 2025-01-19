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
    handleArrayFieldChange,
    handleCheckboxChange,
    handleImageChange,
} from '@/util/formikHelpers';
import { Button } from '@/components/ui/button';
import { GoX } from 'react-icons/go';
import ComboboxFormik from '@/components/ui/ComboboxFormik';
import Remove from '@/components/button/Remove';
import Add from '@/components/button/Add';
import { Error } from '@/components/ui/error';
import PageTitle from '@/components/admin/common/PageTitle';

export default function TalentPoolScholarshipForm() {
    const formInfo = {
        slNo: '100001',
        organizer: {
            name: 'Student Welfare Trust Fulbaria',
            address: 'K. N. B. Bazar, Fulbaria, Gazipur',
            founded: '2006',
        },
        formTitle: 'Talent Pool Scholarship Form',
        formName: 'Admin Card',
        scholarshipType: 'Monthly',
        scholarshipAmount: '500',
        note: [
            'Must bring admit card to exam hall',
            'Bring a pen, pencil, etc for your examination',
        ],
        contact: ['01987654321', '01123456789', '01876543219'],
        email: 'example@mail.com',
    };

    const currentDate = new Date().toISOString().split('T')[0];

    const initialValues = {
        slNo: formInfo?.slNo || '',
        applicantNameBn: '',
        applicantNameEn: '',
        image: null,
        dob: '',
        bloodGroup: '',
        fatherName: '',
        motherName: '',
        alternativeGuardianName: '',
        alternativeGuardianAddress: '',
        contact: '',
        fatherOrGuardianOccupation: '',
        fatherOrGuardianMonthlyIncome: '',
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
        hasPreviousScholarship: false,
        previousScholarshipAmount: '',
        schoolName: '',
        schoolAddress: '',
        aimInLife: '',
        lastFinalExaminationDetails: {
            examName: '',
            examYear: '',
            instituteName: '',
            boardName: '',
            totalMarks: '',
            // subjects: [
            //     {
            //         name: '',
            //         marks: '',
            //     },
            // ],
        },
        lastFinalExaminationResults: [
            {
                subject: '',
                marks: '',
            },
        ],
        applicantBackDetails: {
            bankName: '',
            bankBranchName: '',
            bKashNumber: '',
        },
        monthlyEducationalCost: '',
        familyMemberCount: '', // Total number of family members
        siblings: [
            {
                name: '',
                age: '',
                class: '', // For students, specify their class/grade
                occupation: '', // For non-students, specify their occupation
            },
        ],
        extracurricularSkills: '',
        futureThoughtsAboutOurOrganization: '',
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

        dob: Yup.date()
            .required('Date of birth is required')
            .max(new Date(), 'Date of birth cannot be in the future'),

        bloodGroup: Yup.string()
            .oneOf(
                ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
                'Invalid blood group'
            )
            .required('Blood group is required'),

        fatherName: Yup.string().required("Father's name is required"),
        motherName: Yup.string().required("Mother's name is required"),

        alternativeGuardianName: Yup.string().nullable(),
        alternativeGuardianAddress: Yup.string().nullable(),

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

        fatherOrGuardianOccupation: Yup.string().required(
            'Occupation is required'
        ),
        fatherOrGuardianMonthlyIncome: Yup.number()
            .typeError('Monthly income must be a number')
            .required('Monthly income is required'),

        permanentAddress: Yup.object().shape({
            village: Yup.string().required('Village is required'),
            postOffice: Yup.string().required('Post office is required'),
            subdistrict: Yup.string().required('Subdistrict is required'),
            district: Yup.string().required('District is required'),
        }),

        isCurrentAddressSameAsPermanentAddress: Yup.boolean(),

        currentAddress: Yup.lazy((currentAddress, { parent }) => {
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

        hasPreviousScholarship: Yup.boolean(),
        previousScholarshipAmount: Yup.lazy((currentAddress, { parent }) => {
            if (parent.hasPreviousScholarship) {
                return Yup.number()
                    .typeError('Previous scholarship amount must be a number')
                    .required('Scholarship amount is required');
            } else {
                return Yup.number().typeError(
                    'Previous scholarship amount must be a number'
                );
            }
        }),

        schoolName: Yup.string().required('School name is required'),
        schoolAddress: Yup.string().nullable(),

        aimInLife: Yup.string()
            .required('Please share your aim in life')
            .max(250, 'Aim should not exceed 250 characters'),

        lastFinalExaminationDetails: Yup.object().shape({
            examName: Yup.string().required('Exam name is required'),
            examYear: Yup.number()
                .typeError('Year must be a number')
                .required('Exam year is required')
                .min(1900, 'Year cannot be before 1900')
                .max(new Date().getFullYear(), 'Year cannot be in the future'),
            instituteName: Yup.string().required('Institute name is required'),
            boardName: Yup.string().required('Board name is required'),
            totalMarks: Yup.number()
                .typeError('Total marks must be a number')
                .required('Total marks are required'),
        }),

        lastFinalExaminationResults: Yup.array()
            .of(
                Yup.object({
                    subject: Yup.string().required('Subject name is required'),
                    marks: Yup.number()
                        .typeError('Marks must be a number')
                        .required('Marks are required')
                        .min(0, 'Marks cannot be negative')
                        .max(100, 'Marks cannot exceed 100'),
                })
            )
            .min(1, 'At least one subject is required'),

        applicantBackDetails: Yup.object().shape({
            bankName: Yup.string().nullable(),
            bankBranchName: Yup.string().nullable(),
            bKashNumber: Yup.string()
                .nullable()
                .matches(/^(?:\+88|88)?01[3-9]\d{8}$/, 'Invalid bKash number'),
        }),

        monthlyEducationalCost: Yup.number()
            .typeError('Educational cost must be a number')
            .required('Monthly educational cost is required'),

        familyMemberCount: Yup.number()
            .typeError('Family member count must be a number')
            .required('Family member count is required')
            .min(1, 'There must be at least 1 family member'),

        siblings: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Sibling name is required'),
                age: Yup.number()
                    .typeError('Age must be a number')
                    .required('Sibling age is required')
                    .min(1, 'Age must be at least 1'),
                class: Yup.string().nullable(),
                occupation: Yup.string().nullable(),
            })
        ),

        extracurricularSkills: Yup.string().nullable(),

        futureThoughtsAboutOurOrganization: Yup.string()
            .required('Please share your thoughts about our organization')
            .max(300, 'Thoughts should not exceed 300 characters'),
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
        mutationKey: ['scholarship'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='flex flex-col items-center justify-center text-base'>
                <p className='text-xl md:text-2xl text-primary uppercase font-bold'>
                    {formInfo?.organizer?.name}
                </p>
                <p className='font-bold'>{formInfo?.organizer?.address}</p>
                <p className='font-bold'>
                    Since - {formInfo?.organizer?.founded}
                </p>
                <p className='text-lg md:text-xl font-bold'>
                    {formInfo?.formTitle}
                </p>
                <p className='text-lg md:text-xl border-4 mt-2 border-double p-2 w-fit'>
                    {formInfo?.formName}
                </p>
            </div>

            <div className='flex items-center justify-between'>
                <div>
                    <p>Date: {currentDate}</p>
                    <p>SL No: {formik?.values?.slNo && formik?.values?.slNo}</p>
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
                    label='Date of Birth'
                    error={formik.errors.dob}
                    touched={formik.touched.dob}
                >
                    <Input
                        name='dob'
                        type='date'
                        value={formik.values.dob}
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
                    label='Alternative Guardian Name'
                    error={formik.errors.alternativeGuardianName}
                    touched={formik.touched.alternativeGuardianName}
                >
                    <Input
                        name='alternativeGuardianName'
                        placeholder='Alternative Guardian Name'
                        value={formik.values.alternativeGuardianName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Alternative Guardian Address'
                    error={formik.errors.alternativeGuardianAddress}
                    touched={formik.touched.alternativeGuardianAddress}
                >
                    <Input
                        name='alternativeGuardianAddress'
                        placeholder='Alternative Guardian Address'
                        value={formik.values.alternativeGuardianAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Contact Number'
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
                    label="Father / Guardian's Occupation"
                    error={formik.errors.fatherOrGuardianOccupation}
                    touched={formik.touched.fatherOrGuardianOccupation}
                >
                    <Input
                        name='fatherOrGuardianOccupation'
                        placeholder='Occupation'
                        value={formik.values.fatherOrGuardianOccupation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label="Father / Guardian's Monthly Income"
                    error={formik.errors.fatherOrGuardianMonthlyIncome}
                    touched={formik.touched.fatherOrGuardianMonthlyIncome}
                >
                    <Input
                        name='fatherOrGuardianMonthlyIncome'
                        placeholder='Monthly Income'
                        value={formik.values.fatherOrGuardianMonthlyIncome}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
            </div>

            {/* Permanent Address */}
            <PageTitle title='Permanent Address' back={false} />
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
                <PageTitle title='Current Address' back={false} />
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

            <div className='grid gap-2 md:grid-cols-2 w-full'>
                <InputWrapper label='Previous Scholarship ?'>
                    <label className='flex items-center space-x-2 border border-border p-2 rounded-md text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                        <span>Do you have any Previous Scholarship ?</span>
                        <Checkbox
                            checked={formik.values?.hasPreviousScholarship}
                            onCheckedChange={handleCheckboxChange(
                                formik,
                                'hasPreviousScholarship'
                            )}
                        />
                    </label>
                </InputWrapper>

                <InputWrapper
                    label='Previous Scholarship Amount'
                    error={formik.errors.previousScholarshipAmount}
                    touched={formik.touched.previousScholarshipAmount}
                >
                    <Input
                        name='previousScholarshipAmount'
                        placeholder='Previous Scholarship Amount'
                        value={formik.values.previousScholarshipAmount}
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
                        select='id'
                        display='name'
                        name='schoolName'
                        formik={formik}
                        data={formInfo?.eligibleSchools}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Aim in Life'
                    error={formik.errors.aimInLife}
                    touched={formik.touched.aimInLife}
                >
                    <Input
                        name='aimInLife'
                        placeholder='Aim in Life'
                        value={formik.values.aimInLife}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
            </div>

            {/* lastFinalExaminationDetails */}
            <div className='grid md:grid-cols-2 gap-2'>
                {[
                    'examName',
                    'examYear',
                    'instituteName',
                    'boardName',
                    'totalMarks',
                ].map((field) => (
                    <InputWrapper
                        key={field}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        error={
                            formik.errors?.lastFinalExaminationDetails?.[field]
                                ? String(
                                      formik.errors.lastFinalExaminationDetails[
                                          field
                                      ]
                                  )
                                : null
                        }
                        touched={
                            formik.touched?.lastFinalExaminationDetails?.[field]
                        }
                    >
                        <Input
                            name={`lastFinalExaminationDetails.${field}`}
                            placeholder={
                                field.charAt(0).toUpperCase() + field.slice(1)
                            }
                            value={
                                formik.values.lastFinalExaminationDetails[field]
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>
                ))}
            </div>

            {/* lastFinalExaminationResult */}
            <div className='space-y-2'>
                <InputWrapper label='Subjects and Marks'>
                    {formik.values.lastFinalExaminationResults.map(
                        (result, index) => (
                            <div
                                key={index}
                                className='flex gap-2 items-start justify-between'
                            >
                                <div className='w-full'>
                                    <Input
                                        name={`lastFinalExaminationResults[${index}].subject`}
                                        placeholder={`Subject ${index + 1}`}
                                        value={result.subject}
                                        onChange={(e) =>
                                            formik.setFieldValue(
                                                `lastFinalExaminationResults[${index}].subject`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Error
                                        error={
                                            formik?.errors
                                                ?.lastFinalExaminationResults?.[
                                                index
                                            ]?.subject
                                        }
                                        touched={
                                            formik?.touched
                                                ?.lastFinalExaminationResults?.[
                                                index
                                            ]?.subject
                                        }
                                    />
                                </div>
                                <div className='w-full'>
                                    <Input
                                        name={`lastFinalExaminationResults[${index}].marks`}
                                        placeholder='Marks'
                                        type='number'
                                        value={result.marks}
                                        onChange={(e) =>
                                            formik.setFieldValue(
                                                `lastFinalExaminationResults[${index}].marks`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Error
                                        error={
                                            formik?.errors
                                                ?.lastFinalExaminationResults?.[
                                                index
                                            ]?.marks
                                        }
                                        touched={
                                            formik.touched
                                                .lastFinalExaminationResults?.[
                                                index
                                            ]?.marks
                                        }
                                    />
                                </div>
                                <div className='max-w-12 flex items-center'>
                                    <Remove
                                        disabled={
                                            formik.values
                                                .lastFinalExaminationResults
                                                .length === 1
                                        }
                                        onClick={() =>
                                            handleArrayFieldChange(
                                                formik,
                                                'remove',
                                                'lastFinalExaminationResults',
                                                index
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )
                    )}
                </InputWrapper>
                <Add
                    label='Add Subject'
                    onClick={() =>
                        handleArrayFieldChange(
                            formik,
                            'add',
                            'lastFinalExaminationResults'
                        )
                    }
                />
            </div>

            <div className='grid gap-2 md:grid-cols-3'>
                {['bankName', 'bankBranchName', 'bKashNumber'].map((field) => (
                    <InputWrapper
                        key={field}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        error={formik.errors?.applicantBackDetails?.[field]}
                        touched={formik.touched?.applicantBackDetails?.[field]}
                    >
                        <Input
                            name={`applicantBackDetails.${field}`}
                            placeholder={
                                field.charAt(0).toUpperCase() + field.slice(1)
                            }
                            value={formik.values.applicantBackDetails[field]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>
                ))}
            </div>

            <div className='grid gap-2 md:grid-cols-2 w-full'>
                <InputWrapper
                    label='Monthly Educational Cost'
                    error={formik.errors.monthlyEducationalCost}
                    touched={formik.touched.monthlyEducationalCost}
                >
                    <Input
                        name='monthlyEducationalCost'
                        placeholder='Monthly Educational Cost'
                        value={formik.values.monthlyEducationalCost}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Total Family Member'
                    error={formik.errors.familyMemberCount}
                    touched={formik.touched.familyMemberCount}
                >
                    <Input
                        name='familyMemberCount'
                        placeholder='Total Family Member'
                        value={formik.values.familyMemberCount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
            </div>

            <div className='space-y-2'>
                <InputWrapper label='Brother and Sister Details'>
                    {formik.values.siblings.map((sibling, index) => (
                        <div
                            key={index}
                            className='flex gap-2 items-start justify-between'
                        >
                            <div className='w-full'>
                                <Input
                                    name={`siblings[${index}].name`}
                                    placeholder={`Sibling name`}
                                    value={sibling.name}
                                    onChange={(e) =>
                                        formik.setFieldValue(
                                            `siblings[${index}].name`,
                                            e.target.value
                                        )
                                    }
                                />
                                <Error
                                    error={
                                        formik?.errors?.siblings?.[index]?.name
                                    }
                                    touched={
                                        formik?.touched?.siblings?.[index]?.name
                                    }
                                />
                            </div>
                            <div className='w-full'>
                                <Input
                                    name={`siblings[${index}].age`}
                                    placeholder={`Sibling age`}
                                    value={sibling.age}
                                    onChange={(e) =>
                                        formik.setFieldValue(
                                            `siblings[${index}].age`,
                                            e.target.value
                                        )
                                    }
                                />
                                <Error
                                    error={
                                        formik?.errors?.siblings?.[index]?.age
                                    }
                                    touched={
                                        formik?.touched?.siblings?.[index]?.age
                                    }
                                />
                            </div>
                            <div className='w-full'>
                                <Input
                                    name={`siblings[${index}].class`}
                                    placeholder={`Sibling class`}
                                    value={sibling.class}
                                    onChange={(e) =>
                                        formik.setFieldValue(
                                            `siblings[${index}].class`,
                                            e.target.value
                                        )
                                    }
                                />
                                <Error
                                    error={
                                        formik?.errors?.siblings?.[index]?.class
                                    }
                                    touched={
                                        formik?.touched?.siblings?.[index]
                                            ?.class
                                    }
                                />
                            </div>
                            <div className='w-full'>
                                <Input
                                    name={`siblings[${index}].occupation`}
                                    placeholder={`Sibling occupation`}
                                    value={sibling.occupation}
                                    onChange={(e) =>
                                        formik.setFieldValue(
                                            `siblings[${index}].occupation`,
                                            e.target.value
                                        )
                                    }
                                />
                                <Error
                                    error={
                                        formik?.errors?.siblings?.[index]
                                            ?.occupation
                                    }
                                    touched={
                                        formik?.touched?.siblings?.[index]
                                            ?.occupation
                                    }
                                />
                            </div>
                            <div className='max-w-12 flex items-center'>
                                <Remove
                                    disabled={
                                        formik.values.siblings.length === 1
                                    }
                                    onClick={() =>
                                        handleArrayFieldChange(
                                            formik,
                                            'remove',
                                            'siblings',
                                            index
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </InputWrapper>
                <Add
                    label='Add Sibling'
                    onClick={() =>
                        handleArrayFieldChange(formik, 'add', 'siblings')
                    }
                />
            </div>

            <div className='grid gap-2 md:grid-cols-2 w-full'>
                <InputWrapper
                    label='Extracurricular Skills'
                    error={formik.errors.extracurricularSkills}
                    touched={formik.touched.extracurricularSkills}
                >
                    <Input
                        name='extracurricularSkills'
                        placeholder='Monthly Educational Cost'
                        value={formik.values.extracurricularSkills}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Future Thoughts About Our Organization'
                    error={formik.errors.futureThoughtsAboutOurOrganization}
                    touched={formik.touched.futureThoughtsAboutOurOrganization}
                >
                    <Input
                        name='futureThoughtsAboutOurOrganization'
                        placeholder='Future Thoughts About Our Organization'
                        value={formik.values.futureThoughtsAboutOurOrganization}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
            </div>

            <div className='flex items-center justify-end space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending || mutation.isSuccess} />
            </div>

            {/* <div>
                Footer
            </div> */}
        </form>
    );
}
