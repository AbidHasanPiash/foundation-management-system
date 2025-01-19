import { z } from 'zod';

import teamExecutiveConstants from './team.executive.constants';
import schemaShared from '@/shared/schema.shared';

// Extract reusable validators from schemaShared
const {
    nonEmptyString,
    optionalNonEmptyString,
    filesValidator,
    validEmail,
    validDate,
    validMongooseId,
} = schemaShared;

// Common reusable validators for array-based fields
const image = filesValidator(
    'Image',
    teamExecutiveConstants.allowedMimeTypes,
    5 * 1024 * 1024,
    1,
    1
).optional(); // 5MB

// Define the Zod validation schema based on the Mongoose model
const createSchema = z
    .object({
        name: nonEmptyString('Name'),
        email: validEmail('Email'),
        image,
        typeId: nonEmptyString('Type ID'),
        statusId: nonEmptyString('Status ID'),
        joinDate: validDate('Join date'),
        designation: nonEmptyString('Designation'),
        organization: nonEmptyString('Organization'),
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        id: z.string().nonempty('Team type id is required'),
        name: optionalNonEmptyString('Name'),
        email: validEmail('Email').optional(),
        image,
        typeId: validMongooseId('Type ID').optional(),
        statusId: validMongooseId('Status ID').optional(),
        joinDate: validDate('Join date').optional(),
        designation: optionalNonEmptyString('Designation'),
        organization: optionalNonEmptyString('Organization'),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine((data) => Object.keys(data).length > 0, {
        message:
            'At least one of "id", "name", "email", "image", "typeId", "statusId", "joinDate", "designation", or "organization" is required for update.',
    });

const teamExecutiveSchema = {
    createSchema,
    updateSchema,
};

export default teamExecutiveSchema;
