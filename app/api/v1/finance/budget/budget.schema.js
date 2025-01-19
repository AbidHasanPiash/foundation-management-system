import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';

// Define reusable schema parts
const {
    nonEmptyString,
    optionalNonEmptyString,
    nonNegativeNumber,
    validMongooseId,
} = schemaShared;

const purpose = nonEmptyString('Budget purpose');
const note = optionalNonEmptyString('Budget note');
const paymentDetails = nonEmptyString('Budget bank details');
const budgetAmount = nonNegativeNumber('Budget amount');
const description = optionalNonEmptyString('Description');

// Create schema for new budget (all fields in `budget` array are required)
const createSchema = z
    .object({
        eventId: validMongooseId('Event ID'),
        budget: z
            .array(
                z.object({
                    purpose, // Required
                    note, // Required
                    paymentDetails, // Required
                    budgetAmount, // Required
                })
            )
            .nonempty('At least one budget entry is required'),
        description,
    })
    .strict();

// Update schema for existing budget (fields in `budget` array can be optional)
const updateSchema = z
    .object({
        id: validMongooseId('Budget ID'),
        eventId: nonEmptyString('Event ID').optional(),
        budget: z
            .array(
                z.object({
                    purpose: purpose.optional(), // Optional for update
                    note, // Optional for update
                    paymentDetails: paymentDetails.optional(), // Optional for update
                    actualAmount: budgetAmount.optional(), // Optional for update
                })
            )
            .nonempty('At least one budget entry is required'),
        description,
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Ensure `id` and at least one other field are provided
        {
            message:
                'At least one of "eventId", "budget" is required along with "id".',
        }
    );

// Costing schema for budget update (all fields required for costing)
const costingSchema = z
    .object({
        id: validMongooseId('Budget ID'),
        budget: z
            .array(
                z.object({
                    _id: validMongooseId('Budget Entry ID'),
                    note: optionalNonEmptyString('Budget note'),
                    actualAmount: nonNegativeNumber('Budget actual amount'),
                })
            )
            .nonempty('At least one budget entry is required'),
        description,
    })
    .strict();

const budgetSchema = {
    createSchema,
    updateSchema,
    costingSchema,
};

export default budgetSchema;
