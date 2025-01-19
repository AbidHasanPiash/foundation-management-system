import { z } from 'zod';

import formSpecialScholarshipConstants from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.constants';
import schemaShared from '@/shared/schema.shared';

// Reusable Validators from shared schema
const {
    nonEmptyString,
    nonEmptyBangliString,
    validMobileNumber,
    validMobileNumberArray,
    validEmail,
    validMongooseId,
    nonNegativeNumber,
    nonEmptyStringArray,
    addressDetails,
    booleanString,
    validBloodGroup,
} = schemaShared;

const createSchema = z
    .object({
        formTitle: nonEmptyString('Event name'),
        formName: nonEmptyString('Form name'),
        scholarshipType: nonEmptyString('Scholarship type'),
        scholarshipAmount: z.number(),
        note: z.array(z.string().nonempty('Note cannot be empty')),
        contact: validMobileNumberArray('Contact number'),
        email: validEmail('Email'),
        isActive: booleanString('Form status').optional(),
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        id: validMongooseId('Scholarship event ID'),
        formTitle: nonEmptyString('Event name').optional(),
        formName: nonEmptyString('Form name').optional(),
        scholarshipType: nonEmptyString('Scholarship type').optional(),
        scholarshipAmount: nonNegativeNumber('Scholarship amount'),
        note: nonEmptyStringArray('Note').optional(),
        contact: validMobileNumberArray('Contact number').optional(),
        email: validEmail('Email'),
        isActive: booleanString('Form status').optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "formTitle", "formName", "scholarshipType", "scholarshipAmount", "note", "contact" or "email" is required along with "id".',
        }
    );

const postData = z
    .object({
        id: validMongooseId('Scholarship event ID'),
        statusId: validMongooseId('Scholarship form status ID'),
        applicantNameBn: nonEmptyBangliString('Applicant name (Bangla)'),
        applicantNameEn: nonEmptyString('Applicant name (English)'),
        dob: nonEmptyString('Date of birth'),
        bloodGroup: validBloodGroup('Blood group'),
        fatherName: nonEmptyString("Father's name"),
        motherName: nonEmptyString("Mother's name"),
        alternativeGuardianName: nonEmptyString(
            'Alternative guardian name'
        ).optional(),
        alternativeGuardianAddress: nonEmptyString(
            'Alternative guardian address'
        ).optional(),
        contact: validMobileNumber('Contact number'),
        fatherOrGuardianOccupation: nonEmptyString(
            'Father or guardian occupation'
        ),
        fatherOrGuardianMonthlyIncome: nonNegativeNumber(
            'Father or guardian monthly income'
        ),
        image: z
            .array(
                z
                    .instanceof(File, { message: 'Image must be a file' })
                    .refine((file) => file.size > 0, {
                        message: 'Image file cannot be empty',
                    })
                    .refine(
                        (file) =>
                            formSpecialScholarshipConstants.allowedMimeTypes.includes(
                                file.type
                            ),
                        {
                            message: `Image file type must be one of ${formSpecialScholarshipConstants.allowedMimeTypes.join(', ')}`,
                        }
                    )
            )
            .nonempty('At least one image file is required'),
        permanentAddress: addressDetails('Permanent address'),
        isCurrentAddressSameAsPermanentAddress: booleanString(
            'Is current address same as permanent address'
        ).optional(),
        currentAddress: addressDetails('Current address').optional(),
        hasPreviousScholarship: booleanString(
            'Has previous scholarship'
        ).optional(),
        previousScholarshipAmount: nonNegativeNumber(
            'Previous scholarship amount'
        ).optional(),
        schoolName: nonEmptyString('School name'),
        schoolAddress: nonEmptyString('School address'),
        aimInLife: nonEmptyString('Aim in life'),
        lastFinalExaminationDetails: z.object({
            examName: nonEmptyString('Exam name').optional(),
            examYear: nonNegativeNumber('Exam year').optional(),
            instituteName: nonEmptyString('Institute name').optional(),
            boardName: nonEmptyString('Board name').optional(),
            totalMarks: nonNegativeNumber('Total marks').optional(),
        }),
        lastFinalExaminationResults: z
            .array(
                z.object({
                    subject: nonEmptyString('Subject name'),
                    marks: nonNegativeNumber('Marks'),
                })
            )
            .optional(),
        applicantBankDetails: z.object({
            bankName: nonEmptyString('Bank name'),
            bankBranchName: nonEmptyString('Bank branch name'),
            bKashNumber: nonEmptyString('Bkash number'),
        }),
        monthlyEducationalCost: nonNegativeNumber('Monthly educational cost'),
        familyMemberCount: nonNegativeNumber('Family member count'),
        siblings: z.array(
            z.object({
                name: nonEmptyString('Sibling name').optional(),
                age: nonNegativeNumber('Sibling age').optional(),
                class: nonEmptyString('Sibling class').optional(),
                occupation: nonEmptyString('Sibling occupation').optional(),
            })
        ),
        extracurricularSkills: nonEmptyString('Extra curricular skills'),
        futureThoughtsAboutOurOrganization: nonEmptyString(
            'Future thought about our organization'
        ),
    })
    .strict(); // Enforce strict mode to disallow extra fields

const updatePostDataStatus = z
    .object({
        id: validMongooseId('Scholarship form ID'),
        dataId: validMongooseId('Scholarship form data ID'),
        statusId: validMongooseId('Scholarship form data status ID'),
    })
    .strict(); // Enforce strict mode to disallow extra fields

const formSpecialTalentPoolScholarshipSchema = {
    createSchema,
    updateSchema,
    postData,
    updatePostDataStatus,
};

export default formSpecialTalentPoolScholarshipSchema;
