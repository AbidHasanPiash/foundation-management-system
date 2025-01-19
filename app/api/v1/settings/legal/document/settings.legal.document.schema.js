import { z } from 'zod';

import settingsLegalDocumentConstants from '@/app/api/v1/settings/legal/document/settings.legal.document.constants';
import schemaShared from '@/shared/schema.shared';

const { nonEmptyString, validDate, validFile, validUrl } = schemaShared;
const { allowedMimeTypes, maxFileSize } = settingsLegalDocumentConstants;

const title = nonEmptyString('Title');
const effectiveDate = validDate('Effective date');
const description = nonEmptyString('Description');

const documents = z
    .array(
        z.object({
            link: validUrl('Document link').optional(),
            name: nonEmptyString('Document name'),
            document: validFile(
                'File',
                allowedMimeTypes,
                maxFileSize
            ).optional(),
        })
    )
    .nonempty('At least one file is required')
    .optional();

// Define the Zod validation schema based on the Mongoose model
const createSchema = z
    .object({
        title,
        effectiveDate,
        description,

        documents, // Array of document objects
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z
    .object({
        title: title.optional(),
        effectiveDate: effectiveDate.optional(),
        description: description.optional(),

        documents, // Array of document objects
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine((data) => Object.keys(data).length > 0, {
        message:
            'At least one of "title", "effectiveDate", "description" or "documents" along with "id" is required for update.',
    });

const settingsLegalDocumentSchema = {
    createSchema,
    updateSchema,
};

export default settingsLegalDocumentSchema;
