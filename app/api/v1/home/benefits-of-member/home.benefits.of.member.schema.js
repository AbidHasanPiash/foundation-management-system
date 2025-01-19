import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';

// Define reusable schema parts
const { nonEmptyString, validMongooseId } = schemaShared;

const text = nonEmptyString('Text');

// Define the Zod validation schema
const createSchema = z
    .object({
        text,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        id: validMongooseId('Benefits of members text ID'),
        text,
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "text" is required along with "id".',
        }
    );

const homeBenefitsOfMemberSchema = {
    createSchema,
    updateSchema,
};

export default homeBenefitsOfMemberSchema;
