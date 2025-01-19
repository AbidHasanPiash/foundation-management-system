import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';

// Define reusable schema parts
const { nonEmptyString, booleanString, validMongooseId } = schemaShared;

// Base schema for common fields
const baseSchema = {
    category: nonEmptyString('Team category'),
    isSpecial: booleanString('Is special category'),
};

// Schema for creating a team category
const createSchema = z.object(baseSchema).strict(); // Disallow extra fields

const updateSchema = z
    .object({
        id: validMongooseId('Event category ID'),
        ...Object.fromEntries(
            Object.keys(baseSchema).map((key) => [
                key,
                baseSchema[key].optional(),
            ])
        ),
    })
    .strict() // Disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "category" or "isSpecial" is required along with "id"',
        }
    );

const eventCategorySchema = { createSchema, updateSchema };

export default eventCategorySchema;
