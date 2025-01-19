import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';

// Define reusable schema parts
const {
    nonEmptyString,
    validEmail,
    validDate,
    validBloodGroup,
    validBangladeshiNidCardNumber,
    booleanString,
    nonNegativeNumber,
    addressDetails,
    uploadedFile,
} = schemaShared;

// Main Schema
const createSchema = z
    .object({
        memberId: nonEmptyString('Member ID').optional(),
        name: nonEmptyString('Name').optional(),
        email: validEmail('Email'),
        phone: nonEmptyString('Phone number').optional(),
        image: uploadedFile('Image').optional(),
        nid: validBangladeshiNidCardNumber('NID').optional(),
        educationalBackground: nonEmptyString(
            'Educational background'
        ).optional(),
        occupation: nonEmptyString('Occupation').optional(),
        workplace: nonEmptyString('Workplace').optional(),
        designation: nonEmptyString('Designation').optional(),
        bloodGroup: validBloodGroup('Blood group').optional(),
        dob: validDate('Date of birth').optional(),
        fatherName: nonEmptyString("Father's name").optional(),
        spouseName: nonEmptyString("Spouse's name").optional(),
        motherName: nonEmptyString("Mother's name").optional(),
        permanentAddress: addressDetails('Permanent address').optional(),
        isCurrentAddressSameAsPermanentAddress: booleanString(
            'Is current address same as permanent address'
        ).optional(),
        currentAddress: addressDetails('Current address').optional(),
        initialDonation: nonNegativeNumber(
            'Initial donation amount'
        ).optional(),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // At least one field should be present along with `memberId`
        {
            message:
                'At least one of "name", "email", "phone", "image", "nid", "educationalBackground", "occupation", "workplace", "designation", "bloodGroup", "dob", "fatherName", "spouseName", "motherName", "permanentAddress", "currentAddress", "initialDonation" is required along with "memberId".',
        }
    );

const donorMembershipSchema = {
    createSchema,
};

export default donorMembershipSchema;
