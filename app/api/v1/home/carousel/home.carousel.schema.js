import { z } from 'zod';

import homeCarouselConstants from './home.carousel.constants';
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
    homeCarouselConstants.allowedMimeTypes,
    5 * 1024 * 1024
); // 5 MB max size

// Define the Zod validation schema
const createSchema = z
    .object({
        title: nonEmptyString('Title'),
        image,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        id: validMongooseId('Home carousel ID'),
        title: optionalNonEmptyString('Title'),
        image: image.optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "title" or "image" is required along with "id".',
        }
    );

const homeCarouselSchema = {
    createSchema,
    updateSchema,
};

export default homeCarouselSchema;
