import { z } from 'zod';

import memberConstants from '@/app/api/v1/member/member.constants';
import schemaShared from '@/shared/schema.shared';

// Define reusable schema parts
const {
    nonEmptyString,
    optionalNonEmptyString,
    validBloodGroup,
    validEmail,
    validBangladeshiNidCardNumber,
    validMobileNumber,
    validMongooseId,
    filesValidator,
    validDate,
    addressDetails,
    booleanString,
} = schemaShared;

// Common file validation for images
const image = filesValidator(
    'Image',
    memberConstants.allowedMimeTypes,
    5 * 1024 * 1024
); // 5 MB max size

// Common conditional validation for current address
const conditionalCurrentAddressValidation = (data, ctx) => {
    if (
        data.isCurrentAddressSameAsPermanentAddress === false &&
        !data.currentAddress
    ) {
        ctx.addIssue({
            path: ['currentAddress'],
            code: z.ZodIssueCode.custom,
            message:
                'Current address is required if it is not the same as the permanent address.',
        });
    }
};

// Base schema for common fields
const baseSchema = {
    name: nonEmptyString('Name'),
    email: validEmail('Email'),
    phone: validMobileNumber('Phone number'),
    image,
    nid: validBangladeshiNidCardNumber('NID'),
    educationalBackground: nonEmptyString('Educational background'),
    occupation: nonEmptyString('Occupation'),
    joinDate: validDate('Join date'),
    workplace: nonEmptyString('Workplace'),
    designation: nonEmptyString('Designation'),
    bloodGroup: validBloodGroup('Blood group'),
    dob: validDate('Date of birth'),
    fatherName: nonEmptyString('Father’s name'),
    spouseName: optionalNonEmptyString("Spouse's name"),
    motherName: nonEmptyString('Mother’s name'),
    permanentAddress: addressDetails('Permanent address'),
    isCurrentAddressSameAsPermanentAddress: booleanString(
        'Is current address same as permanent address'
    ),
    currentAddress: addressDetails('Current address'),
};

// Create schema
const createSchema = z
    .object(baseSchema)
    .strict() // Disallow extra fields
    .superRefine(conditionalCurrentAddressValidation);

// Create by admin schema
const createByAdminSchema = z
    .object({
        typeId: validMongooseId('Member type ID'),
        statusId: validMongooseId('Member status ID'),
        ...baseSchema,
    })
    .strict() // Disallow extra fields
    .superRefine(conditionalCurrentAddressValidation);

// Update schema
const updateByAdminSchema = z
    .object({
        id: z.string().nonempty('Member ID is required'),
        typeId: validMongooseId('Member type ID').optional(),
        statusId: validMongooseId('Member status ID').optional(),
        ...Object.fromEntries(
            Object.keys(baseSchema).map((key) => [
                key,
                baseSchema[key].optional(),
            ])
        ),
    })
    .strict() // Disallow extra fields
    .superRefine(conditionalCurrentAddressValidation)
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of the following is required along with "id": "type", "status", "name", "email", "phone", "image", "nid", "educationalBackground", "occupation", "workplace", "joinDate", "designation", "bloodGroup", "dob", "fatherName", "spouseName", "motherName", "permanentAddress", "isCurrentAddressSameAsPermanentAddress", or "currentAddress".',
        }
    );

// Update schema
const updateSchema = z
    .object({
        id: z.string().nonempty('Member ID is required'),
        ...Object.fromEntries(
            Object.keys(baseSchema).map((key) => [
                key,
                baseSchema[key].optional(),
            ])
        ),
    })
    .strict() // Disallow extra fields
    .superRefine(conditionalCurrentAddressValidation)
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of the following is required along with "id": "type", "status", "name", "email", "phone", "image", "nid", "educationalBackground", "occupation", "workplace", "joinDate", "designation", "bloodGroup", "dob", "fatherName", "spouseName", "motherName", "permanentAddress", "isCurrentAddressSameAsPermanentAddress", or "currentAddress".',
        }
    );

// Final member schema object
const memberSchema = {
    createSchema,
    createByAdminSchema,
    updateByAdminSchema,
    updateSchema,
};

export default memberSchema;
