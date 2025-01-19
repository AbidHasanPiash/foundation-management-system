import { z } from 'zod';

import eventConstants from '@/app/api/v1/event/event.constants';
import schemaShared from '@/shared/schema.shared';

// Reusable Validators from shared schema
const { nonEmptyString, validMongooseId, validUrl, validFile, filesValidator } =
    schemaShared;
const { allowedMimeTypes, allowedBannerFileSize } = eventConstants;

const links = z
    .array(
        z.object({
            name: nonEmptyString('Link name').optional(),
            link: validUrl('Link').nullable().optional(), // Allows `null` for link field
        })
    )
    .optional();

const banner = filesValidator(
    'Banner',
    allowedMimeTypes.banner,
    allowedBannerFileSize,
    1,
    1
).optional();

const files = z
    .array(
        z.object({
            name: nonEmptyString('File name'),
            file: validFile(
                'File',
                allowedMimeTypes.files,
                allowedBannerFileSize
            ).optional(),
        })
    )
    .nonempty('At least one file is required')
    .optional();

// Define the Zod validation schema
const createSchema = z
    .object({
        categoryId: validMongooseId('Event category ID'), // ObjectId represented as string
        subcategoryId: validMongooseId('Event subcategory ID'), // ObjectId represented as string
        statusId: validMongooseId('Event status ID'), // ObjectId represented as string
        specialFormId: validMongooseId('Special form ID').optional(), // ObjectId represented as string
        title: nonEmptyString('Event title'),
        eventDate: nonEmptyString('Event date'),
        description: nonEmptyString('Event description'),

        banner,

        files, // Array of file objects

        links, // Array of link objects
    })
    .strict();

// Define the Zod validation schema
const updateSchema = z
    .object({
        id: validMongooseId('Team category id is required'),
        categoryId: validMongooseId('Event category ID is required').optional(), // ObjectId represented as string
        subcategoryId: validMongooseId(
            'Event subcategory ID is required'
        ).optional(), // ObjectId represented as string
        statusId: validMongooseId('Event status ID is required').optional(), // ObjectId represented as string
        specialFormId: validMongooseId(
            'Special form ID is required'
        ).optional(), // ObjectId represented as string
        title: nonEmptyString('Event title').optional(),
        eventDate: nonEmptyString('Event date').optional(),
        description: nonEmptyString('Event description').optional(),

        banner,

        files, // Array of file objects

        links, // Array of link objects
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "id", "categoryId", "subcategoryId", "statusId", "specialFormId", "title", "eventDate", "description", "banner", "files", or "links" is required along with "id".',
        }
    );

const eventSchema = {
    createSchema,
    updateSchema,
};

export default eventSchema;
