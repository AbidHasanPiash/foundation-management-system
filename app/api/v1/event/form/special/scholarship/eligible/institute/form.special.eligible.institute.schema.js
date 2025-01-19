import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';

// Reusable Validators from shared schema
const { nonEmptyString, validMobileNumber, validMongooseId } = schemaShared;

// Main Schema for Create
const createSchema = z
    .object({
        name: nonEmptyString('Institute name'),
        address: nonEmptyString('Institute address'),
        contactPerson: nonEmptyString('Contact person'),
        contactNo: validMobileNumber('Contact number'),
        headOfInstitute: nonEmptyString('Name of the head of institute'),
        headOfInstituteNumber: validMobileNumber('Head of institute number'),
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        id: validMongooseId('Scholarship event id'),
        name: nonEmptyString('Institute name').optional(),
        address: nonEmptyString('Institute address').optional(),
        contactPerson: nonEmptyString('Contact person').optional(),
        contactNo: validMobileNumber('Contact number').optional(),
        headOfInstitute: nonEmptyString(
            'Name of the head of institute'
        ).optional(),
        headOfInstituteNumber: validMobileNumber(
            'Head of institute number'
        ).optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "name", "address", "contactPerson", "contactNo", "headOfInstitute" or "headOfInstituteNumber" is required along with "id".',
        }
    );

const formSpecialEligibleInstituteSchema = {
    createSchema,
    updateSchema,
};

export default formSpecialEligibleInstituteSchema;
