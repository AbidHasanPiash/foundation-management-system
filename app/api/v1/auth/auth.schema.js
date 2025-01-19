import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';

import { decryptData } from '@/util/crypto';

// Define reusable schema parts
const { validEmail, nonEmptyString } = schemaShared;

// Define the Zod validation schema
const email = validEmail('Email');
const password = nonEmptyString('Password', 8, 20);

// Define the Zod validation schema
const loginSchema = z
    .object({
        email,
        password,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const requestNewPassword = z
    .object({
        email,
    })
    .strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const resetPassword = z
    .object({
        token: nonEmptyString('Token'),
        password,
        confirmPassword: nonEmptyString('Confirm password', 8, 20),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .superRefine((data, ctx) => {
        let decodedPassword, decodedConfirmPassword;
        try {
            decodedPassword = decryptData(data?.password); // Decode password
            decodedConfirmPassword = decryptData(data?.confirmPassword); // Decode confirmPassword
        } catch (err) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid encrypted password or confirmPassword',
                path: ['password', 'confirmPassword'],
            });
            return;
        }

        // Check if passwords match after decryption
        if (decodedPassword !== decodedConfirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Passwords must match',
                path: ['confirmPassword'],
            });
        }
    });

const authSchema = {
    loginSchema,
    requestNewPassword,
    resetPassword,
};

export default authSchema;
