import { z } from 'zod';

import mediaNewsConstants from '@/app/api/v1/media/news/media.news.constants';
import schemaShared from '@/shared/schema.shared';

// Define reusable schema parts
const {
    nonEmptyString,
    optionalNonEmptyString,
    validMongooseId,
    filesValidator,
    validFile,
    validUrl,
} = schemaShared;
const { allowedMimeTypes, allowedBannerFileSize, allowedFileSize } =
    mediaNewsConstants;

const banner = filesValidator(
    'Banner',
    allowedMimeTypes.banner,
    5 * 1024 * 1024,
    1,
    1
).optional(); // 5 MB max size
const files = z
    .array(
        z.object({
            link: validUrl('File link').optional(),
            name: nonEmptyString('File name'),
            file: validFile(
                'File',
                allowedMimeTypes.files,
                allowedBannerFileSize
            ).optional(),
        })
    )
    .optional();
const links = z
    .array(
        z.object({
            name: nonEmptyString('Link name'),
            link: validUrl('Link'),
        })
    )
    .optional();

// Define the Zod validation schema for creating a news
const createSchema = z
    .object({
        title: nonEmptyString('Title'),
        banner,
        description: nonEmptyString('Description'),
        files,
        links,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema for updating a news
const updateSchema = z
    .object({
        id: validMongooseId('News ID'),
        title: optionalNonEmptyString('Title'),
        banner,
        description: optionalNonEmptyString('Description'),
        files,
        links,
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "title", "banner", "description", "files" or "links" is required along with "id".',
        }
    );

const mediaNewsSchema = {
    createSchema,
    updateSchema,
};

export default mediaNewsSchema;
