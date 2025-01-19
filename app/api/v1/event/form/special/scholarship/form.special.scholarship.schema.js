import { z } from 'zod';

import formSpecialScholarshipConstants from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.constants';
import schemaShared from '@/shared/schema.shared';

// Reusable Validators
const {
    nonEmptyString,
    nonEmptyBangliString,
    booleanString,
    addressDetails,
    filesValidator,
    validMongooseId,
    validMongooseIdArray,
    validDate,
} = schemaShared;

const exam = z.array(
    z.object({
        subject: nonEmptyString('Subject is required'),
        date: nonEmptyString('Exam date is required'),
        time: nonEmptyString('Exam time is required'),
    })
);

// Create Schema
const createSchema = z
    .object({
        formTitle: nonEmptyString('Event name is required'),
        formName: nonEmptyString('Form name is required'),
        lastDate: validDate('Form last date is required'),
        venue: nonEmptyString('Venue name is required'),
        eligibleSchools: validMongooseIdArray('Eligible school IDs'),
        exam,
        note: z.array(nonEmptyString('Note cannot be empty')).optional(),
        isActive: booleanString('Form status').optional(),
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Update Schema
const updateSchema = z
    .object({
        id: validMongooseId('Scholarship event ID'),
        formTitle: nonEmptyString('Event name is required').optional(),
        formName: nonEmptyString('Form name is required').optional(),
        lastDate: validDate('Form last date is required').optional(),
        venue: nonEmptyString('Venue name is required').optional(),
        eligibleSchools: validMongooseIdArray('Eligible school IDs').optional(),
        exam: exam.optional(),
        note: z.array(nonEmptyString('Note cannot be empty')).optional(),
        isActive: booleanString('Form status').optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "formTitle", "formName", "lastDate", "venue", "eligibleSchools", "exam", "note" and "isActive" is required along with "id".',
        }
    );

const updateSchema2 = z
    .object({
        id: validMongooseId('Scholarship event ID'),
        formTitle: nonEmptyString('Event name is required').optional(),
        formName: nonEmptyString('Form name is required').optional(),
        lastDate: nonEmptyString('Form last date is required').optional(),
        venue: nonEmptyString('Venue name is required').optional(),
        eligibleSchools: validMongooseIdArray('Eligible school IDs').optional(),
        exam: exam.optional(),
        note: z.array(nonEmptyString('Note cannot be empty')).optional(),
    })
    .strict()
    .refine(
        (data) => {
            // Dynamically get all the keys in the object schema
            const schemaKeys = Object.keys(updateSchema.shape);

            // Filter out 'id' from the keys (since it is always required)
            const requiredFields = schemaKeys.filter((field) => field !== 'id');

            // Get the missing fields (those that are undefined or null in the data)
            const missingFields = requiredFields.filter(
                (field) => !data[field]
            );

            // If there are missing fields, return false and dynamically generate the message
            if (missingFields.length > 0) {
                // Dynamically create the error message for missing required fields
                const message = `At least one of the following fields is required along with "id": ${missingFields.join(', ')}.`;
                return new z.ZodError([
                    {
                        message,
                        path: [''], // Add your path if necessary
                        code: z.ZodErrorCode.custom, // Custom error code
                    },
                ]); // Throw a ZodError with dynamic message
            }

            return true; // Valid data
        },
        {
            message: 'At least one of the required fields is missing.', // General fallback message
        }
    );

// Post Data Schema
const postData = z
    .object({
        id: validMongooseId('Scholarship form ID'),
        applicantNameBn: nonEmptyBangliString(
            'Applicant name in (Bangla) is required'
        ),
        applicantNameEn: nonEmptyString(
            'Applicant name in (English) is required'
        ),
        fatherName: nonEmptyString("Father's name is required"),
        motherName: nonEmptyString("Mother's name is required"),
        schoolName: nonEmptyString('School name is required'),
        classRollNo: nonEmptyString('Class roll number is required'),
        contact: nonEmptyString('Contact number is required'),
        image: filesValidator(
            'Image',
            formSpecialScholarshipConstants.allowedMimeTypes,
            5 * 1024 * 1024
        ), // 5 MB max size
        permanentAddress: addressDetails('Permanent address').required(),
        isCurrentAddressSameAsPermanentAddress: booleanString(
            'Is current address same as permanent address'
        ).optional(),
        currentAddress: addressDetails('Current address').optional(),
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Update Post Data Status Schema
const updatePostDataStatus = z
    .object({
        id: validMongooseId('Scholarship form ID'),
        dataId: validMongooseId('Scholarship form data ID'),
        statusId: validMongooseId('Scholarship form data status ID'),
    })
    .strict(); // Enforce strict mode to disallow extra fields

const formSpecialScholarshipSchema = {
    createSchema,
    updateSchema,
    postData,
    updatePostDataStatus,
};

export default formSpecialScholarshipSchema;
