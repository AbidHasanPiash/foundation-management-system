import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import mediaPhotoConstants from '@/app/api/v1/media/photo/media.photo.constants';

// Define reusable schema parts
const {
    nonEmptyString,
    optionalNonEmptyString,
    validMongooseId,
    filesValidator,
    validDate,
} = schemaShared;

const image = filesValidator(
    'Image',
    mediaPhotoConstants.allowedMimeTypes,
    5 * 1024 * 1024
); // 5 MB max size

// Define the Zod validation schema
const createSchema = z
    .object({
        title: nonEmptyString('Title'),
        description: nonEmptyString('Description'),
        date: validDate('Date'),
        image,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        id: validMongooseId('Media photo ID'),
        title: optionalNonEmptyString('Title'),
        description: optionalNonEmptyString('Description'),
        date: validDate('Date').optional(),
        image: image.optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "title", "description", "date" or "image" is required along with "id".',
        }
    );

const mediaPhotoSchema = {
    createSchema,
    updateSchema,
};

export default mediaPhotoSchema;
