import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import typeConstants from '@/app/api/v1/type/type.constants';

// Define reusable schema parts
const { enumValidation, nonEmptyString, validMongooseId } = schemaShared;

// Common Type Enum Validation
const type = nonEmptyString('Type');
const id = validMongooseId('Type ID');
const categoryParams = enumValidation(
    'Category',
    typeConstants.allowedCategories
);

// Define the Zod validation schema
const createSchema = z
    .object({
        type,
        categoryParams,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        id,
        categoryParams,
        type: type.optional(),
        category: categoryParams.optional(),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "type" or "category" is required along with "id".',
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

const typeSchema = {
    createSchema,
    updateSchema,
    categorySchema,
    categoryAndIdSchema,
};

export default typeSchema;
