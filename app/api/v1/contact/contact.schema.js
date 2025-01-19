import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';

// Define reusable schema parts
const { nonEmptyString, validEmail } = schemaShared;

// Define the Zod validation schema based on the Mongoose model
const contactSchema = z
    .object({
        name: nonEmptyString('Name'),
        email: validEmail('Email'),
        subject: nonEmptyString('Subject'),
        message: nonEmptyString('Message'),
    })
    .strict(); // Enforce strict mode to disallow extra fields

export default contactSchema;
