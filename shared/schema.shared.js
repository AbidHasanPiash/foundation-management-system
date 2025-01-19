import { z } from 'zod';
import { Types } from 'mongoose';

import constants from '@/constants/constants';
import memberConstants from '@/app/api/v1/member/member.constants';

import { decryptData } from '@/util/crypto';

const nonEmptyString = (fieldName) =>
    z.string().nonempty(`${fieldName} is required`);
const nonEmptyBangliString = (fieldName) =>
    nonEmptyString(fieldName).refine(
        (value) => constants.bangliLanguageRegex.test(value),
        {
            message: `${fieldName} must contain only Bangla characters.`,
        }
    );
const nonEmptyEnglishString = (fieldName) =>
    nonEmptyString(fieldName).refine(
        (value) => constants.englishLanguageRegex.test(value),
        {
            message: `${fieldName} must contain only English characters.`,
        }
    );

const nonEmptyStringArray = (fieldName) => z.array(nonEmptyString(fieldName));
const nonEmptyBangliStringArray = (fieldName) =>
    z.array(nonEmptyBangliString(fieldName));
const nonEmptyEnglishStringArray = (fieldName) =>
    z.array(nonEmptyEnglishString(fieldName));

const optionalNonEmptyString = (fieldName) =>
    nonEmptyString(fieldName).optional();
const optionalNonEmptyBangliString = (fieldName) =>
    nonEmptyBangliString(fieldName).optional();
const optionalNonEmptyEnglishString = (fieldName) =>
    nonEmptyEnglishString(fieldName).optional();

const nonNegativeNumber = (fieldName) =>
    z.number().nonnegative(`${fieldName} is required and cannot be negative`);
const booleanString = (fieldName) =>
    z
        .union([z.boolean(), z.literal('true'), z.literal('false')])
        .transform((value) => {
            if (typeof value === 'boolean') return value;
            return value === 'true'; // Convert 'true' string to boolean true, and 'false' to boolean false
        })
        .refine((value) => value === true || value === false, {
            message: `${fieldName} must be a valid boolean value (true or false)`, // Custom error message with field name
        });

// Dynamic file validator with size check
const validFile = (fieldName, allowedTypes, maxSize) =>
    z
        .instanceof(File, { message: `${fieldName} must be a file` })
        .refine((file) => file.size > 0, {
            message: `${fieldName} file cannot be empty`,
        })
        .refine((file) => allowedTypes.includes(file.type), {
            message: `${fieldName} file type must be one of ${allowedTypes.join(', ')}`,
        })
        .refine((file) => file.size <= maxSize, {
            message: `${fieldName} file size must be less than or equal to ${maxSize / (1024 * 1024)}MB`,
        });

// Reusable schema for file arrays with dynamic validation, including min and max limits
const filesValidator = (
    fieldName,
    allowedTypes,
    maxSize,
    minFiles = 1,
    maxFiles = Infinity
) =>
    z
        .array(validFile(fieldName, allowedTypes, maxSize))
        .nonempty({ message: 'At least one file is required' })
        .min(minFiles, {
            message: `At least ${minFiles} file(s) must be provided`,
        })
        .max(maxFiles, {
            message: `No more than ${maxFiles} file(s) can be provided`,
        })
        .refine((files) => files.every((file) => file.size > 0), {
            // Check that no file in the array is empty
            message: `All files in ${fieldName} must be non-empty`,
        });

const validPassword = (
    fieldName = 'Password',
    minLength = 8,
    maxLength = 128
) =>
    z
        .string()
        .nonempty(`${fieldName} is required`)
        .transform((val) => decryptData(val)) // Decrypt password before validation
        .refine((val) => val.length >= minLength, {
            message: `${fieldName} must be at least ${minLength} characters`,
        })
        .refine((val) => val.length <= maxLength, {
            message: `${fieldName} must be at most ${maxLength} characters`,
        })
        .refine((val) => constants.passwordRegex.test(val), {
            message: `${fieldName} must contain an uppercase letter, lowercase letter, number, and special character`,
        });

const validEmail = (fieldName = 'Email') =>
    nonEmptyString(fieldName) // First, ensure the string is non-empty
        .email(`Invalid ${fieldName.toLowerCase()}`) // Use Zod's email method to check general format
        .regex(
            constants.emailRegex,
            `Invalid ${fieldName.toLowerCase()} format` // Apply the custom regex for stricter validation
        );

const validEmailArray = (fieldName) => z.array(validEmail(fieldName));

const validMobileNumber = (fieldName) =>
    nonEmptyString(fieldName).regex(
        constants.bangladeshMobileRegex,
        `${fieldName} must be a valid Bangladeshi mobile number`
    );

const validMobileNumberArray = (fieldName) =>
    z.array(validMobileNumber(fieldName));

const validBangladeshiNidCardNumber = (fieldName) =>
    nonEmptyString(fieldName)
        .regex(constants.bangladeshNidRegex, {
            message: `${fieldName} must be a valid 10-digit Bangladeshi NID number.`,
        })
        .refine((value) => value.length === 10, {
            message: `${fieldName} must be a 10-digit number.`,
        });

const validMongooseId = (fieldName) =>
    nonEmptyString(`${fieldName} is required`).refine(
        (id) => Types.ObjectId.isValid(id), // Validate if the string is a valid ObjectId format
        { message: `${fieldName} must be a valid ObjectId format` } // Use fieldName in the message
    );

// Define the Zod validation schema
const idValidationSchema = z
    .object({
        id: validMongooseId('ID'),
    })
    .strict(); // Enforce strict mode to disallow extra fields

const validMongooseIdArray = (fieldName) => z.array(validMongooseId(fieldName));

const validUrl = (fieldName) =>
    nonEmptyString(fieldName).url(
        `${fieldName} must be a valid URL and must start with "https://"`
    );

const validUrlArray = (fieldName) => z.array(validUrl(fieldName));

const bankInformation = (fieldName) =>
    z
        .object({
            bankName: nonEmptyString('Bank name'),
            branchName: nonEmptyString('Branch name'),
        })
        .partial()
        .refine(
            (data) => Object.values(data).some((value) => value?.trim() !== ''),
            {
                message: `${fieldName} must include "bankName" or "branchName" when "hasBankDetails" is true.`,
            }
        );

const addressDetails = (fieldName) =>
    z.object({
        village: nonEmptyString(`${fieldName} village`).optional(),
        postOffice: nonEmptyString(`${fieldName} post office`).optional(),
        subdistrict: nonEmptyString(`${fieldName} subdistrict`).optional(),
        district: nonEmptyString(`${fieldName} district`).optional(),
    });

const uploadedFile = (fieldName) =>
    z.object({
        id: nonEmptyString(`${fieldName} ID`),
        link: validUrl(`${fieldName} link`),
    });

const pagination = () =>
    z.object({
        page: nonEmptyString('Page number').optional(),
        limit: nonEmptyString('Limit').optional(),
        isActive: booleanString('Is active').optional(),
    });

const validDate = (fieldName) =>
    nonEmptyString(fieldName).refine(
        (date) => !isNaN(new Date(date).getTime()),
        {
            message: `${fieldName} must be a valid date`,
        }
    );

const enumValidation = (fieldName, allowedTypes) => {
    return z.enum(allowedTypes, {
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be one of ${allowedTypes.join(', ')}`,
    });
};

const validBloodGroup = (fieldName = 'Blood group') =>
    enumValidation(fieldName, constants.bloodGroupTypes);

// Define the Zod validation schema
const updateProfileSchema = z
    .object({
        name: z.string().optional(),
        typeId: z.string().optional(),
        statusId: z.string().optional(),
        email: z.string().email('Invalid email format').optional(),
        phone: z.string().optional(),
        image: z
            .array(
                z
                    .instanceof(File, { message: 'Image must be a file' })
                    .refine((file) => file.size > 0, {
                        message: 'Image file cannot be empty',
                    })
                    .refine(
                        (file) =>
                            memberConstants.allowedMimeTypes.includes(
                                file.type
                            ),
                        {
                            message: `Image file type must be one of ${memberConstants.allowedMimeTypes.join(', ')}`,
                        }
                    )
            )
            .optional(),
        nid: z.string().optional(),
        educationalBackground: z.string().optional(),
        occupation: z.string().optional(),
        joinDate: z
            .string()
            .refine((date) => !isNaN(new Date(date).getTime()), {
                message: 'Join date must be a valid date',
            })
            .optional(),
        workplace: z.string().optional(),
        designation: z.string().optional(),
        bloodGroup: z.string().optional(),
        dob: z
            .string()
            .refine((date) => !isNaN(new Date(date).getTime()), {
                message: 'Date of birth must be a valid date',
            })
            .optional(),
        fatherName: z.string().optional(),
        husbandName: z.string().optional(),
        motherName: z.string().optional(),
        permanentAddress: z
            .object({
                village: z.string().optional(),
                postOffice: z.string().optional(),
                subdistrict: z.string().optional(),
                district: z.string().optional(),
            })
            .optional(),
        isCurrentAddressSameAsPermanentAddress: z
            .string()
            .transform((value) => value.toLowerCase() === 'true') // Convert string to boolean
            .optional(),
        currentAddress: z
            .object({
                village: z.string().optional(),
                postOffice: z.string().optional(),
                subdistrict: z.string().optional(),
                district: z.string().optional(),
            })
            .optional(), // Conditionally required, handled in superRefine
    })
    .strict() // Disallow extra fields
    .superRefine((data, ctx) => {
        if (data.isCurrentAddressSameAsPermanentAddress === false) {
            // If `isCurrentAddressSameAsPermanentAddress` is false, ensure `currentAddress` is provided
            if (!data.currentAddress) {
                ctx.addIssue({
                    path: ['currentAddress'],
                    code: z.ZodIssueCode.custom,
                    message:
                        'Current address is required if it is not the same as the permanent address.',
                });
            }
        }
    })
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "type", "status", "name", "email", "phone", "image", "nid", "educationalBackground", "occupation", "workplace", "joinDate", "designation", "bloodGroup", "dob", "fatherName", "husbandName", "motherName", "permanentAddress", "isCurrentAddressSameAsPermanentAddress", or "currentAddress" is required.',
        }
    );

const schemaShared = {
    idValidationSchema,

    validMongooseId,
    validMongooseIdArray,

    nonEmptyString,
    nonEmptyBangliString,
    nonEmptyEnglishString,

    nonEmptyStringArray,
    nonEmptyBangliStringArray,
    nonEmptyEnglishStringArray,

    optionalNonEmptyString,
    optionalNonEmptyBangliString,
    optionalNonEmptyEnglishString,

    pagination,

    nonNegativeNumber,
    validDate,
    booleanString,

    validFile,
    filesValidator,
    uploadedFile,

    validPassword,

    validEmail,
    validEmailArray,

    validMobileNumber,
    validMobileNumberArray,

    validBangladeshiNidCardNumber,

    validUrl,
    validUrlArray,

    bankInformation,
    addressDetails,

    enumValidation,

    validBloodGroup,

    updateProfileSchema,
};

export default schemaShared;
