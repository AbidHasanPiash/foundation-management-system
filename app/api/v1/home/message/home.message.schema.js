import { z } from 'zod';

import homeMessageConstants from './home.message.constants';
import schemaShared from '@/shared/schema.shared';

// Define reusable schema parts
const {
    nonEmptyString,
    optionalNonEmptyString,
    validMongooseId,
    filesValidator,
} = schemaShared;

const image = filesValidator(
    'Image',
    homeMessageConstants.allowedMimeTypes,
    5 * 1024 * 1024
); // 5 MB max size

// Define the Zod validation schema
const createSchema = z
    .object({
        title: nonEmptyString('Title is required'),
        name: nonEmptyString('Name is required'),
        message: nonEmptyString('Message is required'),
        image,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        id: validMongooseId('Home message ID'),
        title: optionalNonEmptyString('Title'),
        name: optionalNonEmptyString('Name'),
        message: optionalNonEmptyString('Message'),
        image: image.optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "title", "name", "message" or "image" is required along with "id".',
        }
    );

const homeMessageSchema = {
    createSchema,
    updateSchema,
};

export default homeMessageSchema;
