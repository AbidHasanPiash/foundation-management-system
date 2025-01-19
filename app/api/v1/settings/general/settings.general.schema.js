import { z } from 'zod';

import settingsGeneralConstants from './settings.general.constants';
import schemaShared from '@/shared/schema.shared';

// Extract reusable validators from schemaShared
const {
    nonEmptyString,
    filesValidator,
    validEmailArray,
    validMobileNumberArray,
    validUrlArray,
    validDate,
} = schemaShared;

// Common reusable validators for array-based fields
const logo = filesValidator(
    'Logo',
    settingsGeneralConstants.allowedMimeTypes,
    5 * 1024 * 1024
); // 5MB

// Define the Zod validation schema for creating settings
const createSchema = z
    .object({
        name: nonEmptyString('Name'),
        description: nonEmptyString('Description'),
        startDate: validDate('Start date'),
        address: nonEmptyString('Address'),
        emails: validEmailArray('Email'),
        contacts: validMobileNumberArray('Contact'),
        socialLinks: validUrlArray('Social link'),
        logo,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema for updating settings
const updateSchema = z
    .object({
        name: nonEmptyString('Name').optional(),
        description: nonEmptyString('Description').optional(),
        startDate: validDate('Start date').optional(),
        address: nonEmptyString('Address is required').optional(),
        emails: validEmailArray('Email').optional(),
        contacts: validMobileNumberArray('Contact').optional(),
        socialLinks: validUrlArray('Social link').optional(),
        logo: logo.optional(),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 0, // Ensure at least one field (besides 'id') is updated
        {
            message:
                'At least one of "name", "description", "address", "emails", "contacts", "socialLinks", or "logo" is required for update.',
        }
    );

const settingsGeneralSchema = {
    createSchema,
    updateSchema,
};

export default settingsGeneralSchema;
