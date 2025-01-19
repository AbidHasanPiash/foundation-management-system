import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';

// Define reusable schema parts
const {
    nonEmptyString,
    optionalNonEmptyString,
    validMongooseId,
    validUrl,
    validDate,
} = schemaShared;

// Define the Zod validation schema
const createSchema = z
    .object({
        title: nonEmptyString('Title'),
        description: nonEmptyString('Description'),
        date: validDate('Date'),
        link: validUrl('Link'),
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        id: validMongooseId('Media video ID'),
        title: optionalNonEmptyString('Title'),
        description: optionalNonEmptyString('Description'),
        date: validDate('Date').optional(),
        link: validUrl('Link').optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "title", "description", "date" or "link" is required along with "id".',
        }
    );

const mediaVideoSchema = {
    createSchema,
    updateSchema,
};

export default mediaVideoSchema;
