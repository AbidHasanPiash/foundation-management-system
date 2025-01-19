import { z } from 'zod';

import settingsPolicyConstants from './settings.policy.constants';
import schemaShared from '@/shared/schema.shared';

// Extract reusable validators from schemaShared
const { enumValidation, nonEmptyString, optionalNonEmptyString } = schemaShared;

// Common Type Enum Validation
const type = enumValidation('Type', settingsPolicyConstants.allowedTypes);

// Define the Zod validation schema
const createSchema = z
    .object({
        type,
        title: nonEmptyString('Title'),
        description: nonEmptyString('Description'),
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        type: type.optional(),
        title: optionalNonEmptyString('Title'),
        description: optionalNonEmptyString('Description'),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "type", "title", or "description" is required',
        }
    );

// Define the Zod validation schema
const typeSchema = z
    .object({
        type,
    })
    .strict(); // Enforce strict mode to disallow extra fields

const settingsPolicySchema = {
    createSchema,
    updateSchema,
    typeSchema,
};

export default settingsPolicySchema;
