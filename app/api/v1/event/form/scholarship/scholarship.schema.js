import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';

// Reusable Validators from shared schema
const {
    nonEmptyString,
    nonEmptyBangliString,
    booleanString,
    addressDetails,
    uploadedFile,
} = schemaShared;

// Main Schema
const createSchema = z
    .object({
        sl: nonEmptyString('Serial no').optional(),
        applicantNameBn: nonEmptyBangliString(
            "Applicant's name in Bangla"
        ).optional(),
        applicantNameEn: nonEmptyString(
            "Applicant's name in English"
        ).optional(),
        fatherName: nonEmptyString("Applicant's father name").optional(),
        motherName: nonEmptyString("Applicant's mother name").optional(),
        schoolName: nonEmptyString("Applicant's institute name").optional(),
        classRollNo: nonEmptyString('Applicant class roll no').optional(),
        contact: nonEmptyString('Applicant contact no').optional(),
        image: uploadedFile('Image').optional(),
        permanentAddress: addressDetails('Permanent address').optional(),
        isCurrentAddressSameAsPermanentAddress: booleanString(
            'Is current address same as permanent address'
        ).optional(),
        currentAddress: addressDetails('Current address').optional(),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // At least one field should be present along with `sl`
        {
            message:
                'At least one of "applicantNameBn", "applicantNameEn", "fatherName", "motherName", "schoolName", "classRollNo", "contact", "image", "permanentAddress", "isCurrentAddressSameAsPermanentAddress", or "currentAddress" is required along with "sl".',
        }
    );

const scholarshipSchema = {
    createSchema,
};

export default scholarshipSchema;
