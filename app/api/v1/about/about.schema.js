import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import aboutConstants from '@/app/api/v1/about/about.constants';

// Define reusable schema parts
const {
    enumValidation,
    filesValidator,
    validMongooseId,
    nonEmptyString,
    optionalNonEmptyString,
} = schemaShared;
const {
    allowedCategories,
    allowedTypes,
    allowedMimeTypes,
    allowedBannerFileSize,
} = aboutConstants;

// Common Type Enum Validation
const type = enumValidation('Type', allowedTypes);
const banner = filesValidator(
    'Banner',
    allowedMimeTypes,
    allowedBannerFileSize,
    1,
    1
);
const categoryParams = enumValidation('Category', allowedCategories);

// Define the Zod validation schema
const createSchema = z
    .object({
        type,
        categoryParams,
        title: nonEmptyString('Title'),
        description: nonEmptyString('Description'),
        banner,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        categoryParams,
        type,
        title: optionalNonEmptyString('Title'),
        description: optionalNonEmptyString('Description'),
        banner: banner.optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "title", "description" or "banner" is required along with the type',
        }
    );

const categorySchema = z
    .object({
        categoryParams,
    })
    .strict();

const categoryAndIdSchema = z
    .object({
        type,
        categoryParams,
    })
    .strict();

const aboutSchema = {
    createSchema,
    updateSchema,
    categorySchema,
    categoryAndIdSchema,
};

export default aboutSchema;
