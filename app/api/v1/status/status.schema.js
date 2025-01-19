import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import statusConstants from '@/app/api/v1/status/status.constants';

// Define reusable schema parts
const { nonEmptyString, validMongooseId } = schemaShared;

const status = nonEmptyString('Status');
const categoryParams = z.enum(statusConstants.allowedCategories, {
    required_error: 'Category is required',
    invalid_type_error: `Category must be one of ${statusConstants.allowedCategories.join(', ')}`,
});
const id = validMongooseId('Status ID');

// Define the Zod validation schema
const createSchema = z
    .object({
        status,
        categoryParams,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        id,
        categoryParams,
        status: status.optional(),
        category: categoryParams.optional(),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "status" or "category" is required along with "id".',
        }
    );

const categorySchema = z
    .object({
        categoryParams,
    })
    .strict();

const categoryAndIdSchema = z
    .object({
        categoryParams,
        id,
    })
    .strict();

const statusSchema = {
    createSchema,
    updateSchema,
    categorySchema,
    categoryAndIdSchema,
};

export default statusSchema;
