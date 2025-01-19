import { z } from 'zod';

import donationConstants from '@/app/api/v1/finance/donation/donation.constants';
import schemaShared from '@/shared/schema.shared';

// Define reusable schema parts
const {
    optionalNonEmptyString,
    nonNegativeNumber,
    booleanString,
    bankInformation,
    validMongooseId,
} = schemaShared;

// Donation Type (enum validation)
const donationType = z.enum(Object.values(donationConstants.donationType), {
    errorMap: () => ({
        message: `Donation type must be one of ${Object.values(donationConstants.donationType).join(',')}.`,
    }),
});

// Donation Schema for creation
const createSchema = z
    .object({
        donationType, // Enum validation
        memberId: validMongooseId('Member ID').optional(),
        eventId: validMongooseId('Event ID'),
        amount: nonNegativeNumber('Donation amount'),
        paymentMethodId: validMongooseId('Payment method ID'),
        hasBankDetails: booleanString('Bank details status').optional(),
        bankDetails: bankInformation('Bank details').optional(),
        description: optionalNonEmptyString('Description').optional(),
        collectedBy: validMongooseId('Collector member ID'),
    })
    .strict();

// Donation Schema for updating
const updateSchema = z
    .object({
        id: validMongooseId('Donation ID'),
        donationType, // Enum validation (optional for update)
        memberId: validMongooseId('Member ID').optional(),
        eventId: validMongooseId('Event ID').optional(),
        amount: nonNegativeNumber('Donation amount').optional(),
        paymentMethodId: validMongooseId('Payment method ID').optional(),
        hasBankDetails: booleanString('Bank details status').optional(),
        bankDetails: bankInformation('Bank details').optional(),
        description: optionalNonEmptyString('Description').optional(),
        collectedBy: validMongooseId('Collector member ID').optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 1, // Ensure `id` and at least one other field are provided
        {
            message:
                'At least one of "donationType", "amount", "description", "paymentMethodId", "hasBankDetails", or "collectedBy" must be updated along with "id".',
        }
    );

const donationSchema = {
    createSchema,
    updateSchema,
};

export default donationSchema;
