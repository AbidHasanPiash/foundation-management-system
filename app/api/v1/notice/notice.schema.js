import { z } from 'zod';

import noticeConstants from '@/app/api/v1/notice/notice.constants';
import schemaShared from '@/shared/schema.shared';

// Define reusable schema parts
const {
    nonEmptyString,
    validUrl,
    optionalNonEmptyString,
    filesValidator,
    validDate,
} = schemaShared;
const { allowedFileSize, allowedMimeTypes } = noticeConstants;

const publishDate = validDate('Publish date');
const fileName = nonEmptyString('File name').optional();
const file = filesValidator(
    'File',
    allowedMimeTypes,
    allowedFileSize,
    1,
    1
).optional();
const linkName = nonEmptyString('Link name').optional();
const link = validUrl('Link').optional();

// Define the Zod validation schema for creating a notice
const createSchema = z
    .object({
        publishDate,
        title: nonEmptyString('Title'),
        fileName,
        file,
        linkName,
        link,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema for updating a notice
const updateSchema = z
    .object({
        id: z.string().nonempty('Notice ID is required'),
        publishDate: publishDate.optional(),
        title: optionalNonEmptyString('Title'),
        fileName,
        file,
        linkName,
        link,
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "publishDate", "title", "fileName", "file", "linkName" or "link" is required along with "id".',
        }
    );

const noticeSchema = {
    createSchema,
    updateSchema,
};

export default noticeSchema;
