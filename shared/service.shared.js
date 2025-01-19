import mongodb from '@/lib/mongodb';
import httpStatusConstants from '@/constants/httpStatus.constants';
import localFileOperations from '@/util/localFileOperations';
import authConstants from '@/app/api/v1/auth/auth.constants';
import authSchema from '@/app/api/v1/auth/auth.schema';
import authUtilities from '@/app/api/v1/auth/auth.utilities';
import authEmailTemplate from '@/app/api/v1/auth/auth.email.template';
import environments from '@/constants/enviornments.constants';
import schemaShared from '@/shared/schema.shared';

import sendResponse from '@/util/sendResponse';
import toSentenceCase from '@/util/toSentenceCase';
import validateToken from '@/util/validateToken';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import comparePassword from '@/util/comparePassword';
import { decryptData, encryptData } from '@/util/crypto';
import getDeviceType from '@/util/getDeviceType';
import createAuthenticationToken from '@/util/createAuthenticationToken';
import generateVerificationToken from '@/util/generateVerificationToken';
import configurations from '@/configs/configurations';
import createHashedPassword from '@/util/createHashedPassword';

const configuration = await configurations();

// Common function for fetching and projecting MongoDB data with custom aggregation
const fetchEntryList = async (model, pipeline, message, request, context) => {
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        schemaShared.pagination
    );

    const { page, limit, isActive } = userInput.query || {};
    const currentPage = page !== undefined ? parseInt(page, 10) : null;
    const pageSize =
        limit !== undefined ? parseInt(limit, 10) : currentPage ? 10 : null; // Default limit if page exists

    // Add isActive filtering to the pipeline if provided
    if (isActive) {
        const isActiveBool = isActive === 'true'; // Convert isActive to boolean
        pipeline.unshift({ $match: { isActive: isActiveBool } }); // Add match stage at the beginning of the pipeline
    }

    // Ensure MongoDB is connected
    await mongodb.connect();

    // Add pagination stages to the pipeline dynamically if applicable
    if (currentPage && pageSize) {
        pipeline.push(
            { $skip: (currentPage - 1) * pageSize },
            { $limit: pageSize }
        );
    }

    // Fetch data using the aggregation pipeline
    const data = await model.aggregate(pipeline);

    // Calculate total count if pagination is applied
    const totalCount =
        currentPage && pageSize
            ? await model.countDocuments(pipeline[0]?.$match || {})
            : data.length;

    // Check if data exists
    if (!data.length) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `No ${message} available at this time.`,
            {},
            {},
            request
        );
    }

    // Prepare pagination metadata if applicable
    const pagination =
        currentPage && pageSize
            ? {
                  currentPage,
                  pageSize,
                  totalPages: Math.ceil(totalCount / pageSize),
                  totalCount,
              }
            : null;

    // Send a success response with the fetched data and pagination metadata
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `${toSentenceCase(message)} retrieved successfully.`,
        data,
        pagination,
        request
    );
};

// Common function for fetching data by id and projecting MongoDB data with custom aggregation
const fetchEntryById = async (model, pipeline, message, request, userInput) => {
    // Ensure MongoDB is connected
    await mongodb.connect();

    // Fetch data using the custom aggregation pipeline
    const data = await model.aggregate(pipeline);

    // Check if data exists
    if (!data.length) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `${message} entry with id "${userInput?.id || userInput?.type}" not found.`,
            {},
            {},
            request
        );
    }

    // Send a success response with the fetched data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `${message} entry with id "${userInput?.id || userInput?.type}" fetched successfully.`,
        data[0],
        {},
        request
    );
};

const deleteEntry = async (
    request,
    context,
    schema,
    model,
    projectionField,
    message
) => {
    // Initialize MongoDB connection
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'delete',
        schema
    );

    // Perform the deletion with the specified projection field for optional file handling
    const entryData = await model.findOneAndDelete(
        { _id: userInput?.id },
        {
            projection: projectionField
                ? { _id: 1, [projectionField]: 1 }
                : { _id: 1 },
        }
    );

    // If no document is found, send a 404 response
    if (!entryData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `${message} entry with ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Optionally delete associated file if projectionField exists and has a value
    if (projectionField && entryData[projectionField]) {
        await localFileOperations.deleteFile(entryData[projectionField]);
    }

    // Send a success response
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `${message} entry with ID "${userInput?.id}" deleted successfully.`,
        {},
        {},
        request
    );
};

const createStatusEntry = async (
    request,
    context,
    model,
    schema,
    contentTypes,
    statusFieldName,
    message
) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        contentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        schema
    );

    // Check if a document with the specified status already exists
    const existingStatus = await model.exists({
        [statusFieldName]: userInput?.[statusFieldName],
    });
    if (existingStatus) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `${statusFieldName.charAt(0).toUpperCase() + statusFieldName.slice(1)} entry with status "${userInput?.[statusFieldName]}" already exists.`,
            {},
            {},
            request
        );
    }

    // Attempt to create a new document with the provided details
    const createdDocument = await model.create(userInput);

    // Validate if the document was successfully created
    if (!createdDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to create ${message} entry.`,
            {},
            {},
            request
        );
    }

    // Retrieve the created document
    const statusData = await model
        .findOne(
            { _id: createdDocument._id },
            {
                _id: 1,
                [statusFieldName]: 1,
            }
        )
        .lean();

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `${toSentenceCase(message)} entry with ${statusFieldName} "${userInput?.[statusFieldName]}" created successfully.`,
        statusData,
        {},
        request
    );
};

const createTypeEntry = async (
    request,
    context,
    model,
    schema,
    contentTypes,
    typeFieldName,
    message
) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        contentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        schema
    );

    // Check if a document with the specified type already exists
    const existingEntry = await model.exists({
        [typeFieldName]: userInput?.[typeFieldName],
    });
    if (existingEntry) {
        return sendResponse(
            false,
            httpStatusConstants.CONFLICT,
            `${message} entry with ${typeFieldName} "${userInput?.[typeFieldName]}" already exists.`,
            {},
            {},
            request
        );
    }

    // Create a new document with the provided details
    const createdDocument = await model.create(userInput);

    // Validate if the document was successfully created
    if (!createdDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to create ${typeFieldName.charAt(0).toUpperCase() + typeFieldName.slice(1)} entry.`,
            {},
            {},
            request
        );
    }

    // Retrieve the created document
    const typeData = await model
        .findOne(
            { _id: createdDocument._id },
            {
                _id: 1,
                [typeFieldName]: 1,
            }
        )
        .lean();

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.CREATED,
        `${typeFieldName.charAt(0).toUpperCase() + typeFieldName.slice(1)} entry with type "${userInput?.[typeFieldName]}" created successfully.`,
        typeData,
        {},
        request
    );
};

const handleUserLogin = async (request, context, userType, userModel) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        authConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        authSchema.loginSchema
    );

    // Establish database connection
    await mongodb.connect();

    // Check if the user exists
    const existingUser = await userModel
        .findOne({ email: userInput.email })
        .lean();
    if (!existingUser) {
        return authUtilities.unauthorizedResponse(
            'Unauthorized access. Please check your email and password and try again.',
            request
        );
    }

    // Get device type
    const userAgent = request.headers.get('User-Agent') || '';
    const deviceType = getDeviceType(userAgent);

    // Validate password
    const isPasswordValid = await comparePassword(
        decryptData(userInput.password),
        existingUser.password
    );
    if (!isPasswordValid) {
        return authUtilities.unauthorizedResponse(
            'Incorrect password. Please try again or use the forgot password option to reset it.',
            request
        );
    }

    // Generate authentication token
    const userTokenData = {
        _id: existingUser._id,
        deviceType,
        userType,
    };
    const { accessToken, refreshToken } =
        await createAuthenticationToken(userTokenData);

    // Encrypt the token for response
    const returnData = {
        accessToken: encryptData(accessToken),
        refreshToken: encryptData(refreshToken),
    };

    // Send login notification email
    await authEmailTemplate.successfulLoginNotification(
        existingUser.email,
        existingUser.name,
        deviceType
    );

    // Return success response
    return authUtilities.authorizedResponse(
        'Authorized.',
        returnData,
        request,
        context
    );
};

const handlePasswordResetRequest = async (request, context, userModel) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        authConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        authSchema.requestNewPassword
    );

    // Establish database connection
    await mongodb.connect();

    // Check if the user exists
    const existingUser = await userModel
        .findOne({ email: userInput.email })
        .lean();
    if (!existingUser) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'User not found. Please sign up first.',
            {},
            {},
            request
        );
    }

    // Generate reset password token
    const { verifyToken, token } = await generateVerificationToken();

    // Calculate token expiration
    const expirationTime = configuration.jwt.resetPasswordToken.expiration;

    // Update user's reset password token and expiration in the database
    const updateResult = await userModel.updateOne(
        { _id: existingUser._id },
        {
            resetPasswordToken: token,
            resetPasswordTokenExpiration: expirationTime,
        }
    );

    if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to proceed reset password request.');
    }

    // Prepare reset password verification email
    const hostname = request.nextUrl.hostname;
    const emailVerificationLink =
        configuration.env === environments.PRODUCTION
            ? `https://${hostname}/auth/reset-password/${token}`
            : `http://${hostname}:3000/auth/reset-password/${token}`;

    // Send reset password email
    await authEmailTemplate.resetPasswordRequestNotification(
        existingUser.email,
        existingUser.name,
        emailVerificationLink
    );

    // Return success response
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Password reset email sent successfully.',
        {},
        {},
        request
    );
};

const handlePasswordReset = async (request, context, userModel) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        authConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'update',
        authSchema.resetPassword
    );

    // Establish Mongoose connection
    await mongodb.connect();

    // Decrypt token
    const decryptedToken = userInput.token;

    // Check if the user with the token exists
    const existingUser = await userModel
        .findOne({
            resetPasswordToken: decryptedToken,
        })
        .lean();
    if (!existingUser) {
        return sendResponse(
            false,
            httpStatusConstants.BAD_REQUEST,
            'Invalid reset password token.',
            {},
            {},
            request
        );
    }

    // Decrypt the new password and hash it
    const decryptedPassword = decryptData(userInput.password);
    const hashedPassword = await createHashedPassword(decryptedPassword);

    // Update the user's password and clear the reset token
    const updateResult = await userModel.updateOne(
        { _id: existingUser._id },
        {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpiration: null,
        }
    );

    if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to reset the password.');
    }

    // Send notification email about the successful password reset
    await authEmailTemplate.resetPasswordSuccessfulNotification(
        existingUser.email,
        existingUser.name
    );

    // Return success response
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Password reset successful.',
        {},
        {},
        request
    );
};

const handleGetProfile = async (request) => {
    // Check if the "about" type already exists in MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Profile fetched successfully.',
        authResult.user,
        {},
        request
    );
};

const serviceShared = {
    fetchEntryList,
    fetchEntryById,
    deleteEntry,
    createStatusEntry,
    createTypeEntry,

    handleUserLogin,
    handlePasswordResetRequest,
    handlePasswordReset,

    handleGetProfile,
};

export default serviceShared;
