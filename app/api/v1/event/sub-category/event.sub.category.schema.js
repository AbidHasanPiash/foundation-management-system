import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';

// Reusable Validators from shared schema
const { nonEmptyString, validMongooseId } = schemaShared;

const category = nonEmptyString('Event category');
const subCategory = nonEmptyString('Event sub category');

// Define the Zod validation schema
const createSchema = z
    .object({
        category,
        subCategory,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        id: validMongooseId('Event sub category ID'),
        category: category.optional(),
        subCategory: subCategory.optional(),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "category" or "subCategory" is required along with "id".',
        }
    );

const eventSubCategorySchema = {
    createSchema,
    updateSchema,
};

export default eventSubCategorySchema;
