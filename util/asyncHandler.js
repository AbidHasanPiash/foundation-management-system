import { z } from 'zod';
import mongoose from 'mongoose';

import httpStatusConstants from '@/constants/httpStatus.constants';
import logger from '@/lib/logger';
import enviornmentsConstants from '@/constants/enviornments.constants';

import configurations from '@/configs/configurations';
import sendResponse from '@/util/sendResponse';

const configuration = await configurations();

export class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
        this.status = httpStatusConstants.BAD_REQUEST;
    }
}

export class CryptoError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CryptoError';
        this.status = httpStatusConstants.INTERNAL_SERVER_ERROR; // 500 Internal Server Error
    }
}

const handleGeneralError = (error) => {
    let message = 'An error occurred while processing the request.';
    let status = httpStatusConstants.INTERNAL_SERVER_ERROR;

    // Specific handling for BSONError (invalid ObjectId)
    if (error?.name === 'BSONError') {
        message = 'Invalid ID format. The provided ID is not valid.';
        status = httpStatusConstants.BAD_REQUEST;
    } else if (error.code === 'ECONNRESET') {
        message =
            'The connection was reset. This may be a temporary network issue. Please try again.';
        status = httpStatusConstants.SERVICE_UNAVAILABLE;
    }

    return {
        success: false,
        message,
        errors: {
            message: error?.message || 'Internal Server Error',
            name: error?.name || 'Error',
            stack: error?.stack || 'No stack trace available',
            code: error?.code || null,
            status,
            cause: error?.cause || null,
            isOperational: error?.isOperational || false,
            fileName: error?.fileName || null,
            lineNumber: error?.lineNumber || null,
            columnNumber: error?.columnNumber || null,
        },
        status,
    };
};

// Utility to handle Zod errors
const handleUnsupportedContentTypeError = (error) => ({
    success: false,
    message: error.message,
    errors: { contentType: error.contentType },
    status: httpStatusConstants.BAD_REQUEST,
});

// Utility to handle BadRequest errors
const handleBadRequestError = (error) => ({
    success: false,
    message: error.message,
    status: httpStatusConstants.BAD_REQUEST,
});

// Utility to handle Zod errors
const handleZodError = (error) => ({
    success: false,
    message: 'Validation error occurred.',
    errors: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
    })),
    status: httpStatusConstants.BAD_REQUEST,
});

// Utility to handle Mongoose errors
const handleMongooseError = (error) => {
    console.log(error);
    let message = 'Database error occurred.';
    let status = httpStatusConstants.INTERNAL_SERVER_ERROR;

    if (error instanceof mongoose.Error.ValidationError) {
        message = 'Validation error occurred in the database.';
        status = httpStatusConstants.BAD_REQUEST;
    } else if (error instanceof mongoose.Error.CastError) {
        message = `Invalid value for ${error.path}: ${error.value}.`;
        status = httpStatusConstants.BAD_REQUEST;
    } else if (error.code === 11000) {
        // Duplicate Key Error
        const field = Object.keys(error.keyPattern)[0];
        message = `Duplicate value error: An entry with the same ${field} already exists.`;
        status = httpStatusConstants.BAD_REQUEST;
    } else if (error.name === 'MongoNetworkError') {
        // Specific handling for SSL/TLS errors
        if (
            error.cause &&
            error.cause.code === 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR'
        ) {
            message =
                'SSL/TLS error occurred while connecting to the database. Please check SSL configuration.';
            status = httpStatusConstants.SERVICE_UNAVAILABLE;
        } else {
            message =
                'Network error while connecting to the database. Please check the network connection or SSL/TLS configuration.';
            status = httpStatusConstants.SERVICE_UNAVAILABLE;
        }
    } else if (error.code === 'EREFUSED') {
        // DNS resolution error
        message =
            'DNS resolution failed while connecting to the database. The MongoDB server may be unavailable.';
        status = httpStatusConstants.SERVICE_UNAVAILABLE;
    } else {
        if (error instanceof mongoose.Error.ConnectionError) {
            message = 'Database connection error.';
            status = httpStatusConstants.SERVICE_UNAVAILABLE;
        }
    }

    return {
        success: false,
        message,
        errors: [error.message],
        status,
    };
};

// Utility to handle Crypto errors
const handleCryptoError = (error) => {
    return {
        success: false,
        message: error.message,
        status: httpStatusConstants.UNAUTHORIZED,
    };
};

export class UnsupportedContentTypeError extends Error {
    constructor(contentType) {
        super(`Unsupported Content-Type: ${contentType}`);
        this.name = 'UnsupportedContentTypeError';
        this.contentType = contentType;
        this.status = httpStatusConstants.UNSUPPORTED_MEDIA_TYPE;
    }
}

// Async handler with switch and instanceOf
const asyncHandler =
    (fn) =>
    async (...args) => {
        logger.info(`STARTED: ${fn.name}`);

        // const [request] = args;
        // // Log request data based on the content type
        // const contentType = request.headers.get("content-type") || "";
        // if (contentType.includes("application/json")) {
        //     const jsonData = await request.json();
        //     logger.info(`Request JSON: ${JSON.stringify(jsonData)}`);
        // } else if (contentType.includes("multipart/form-data")) {
        //     const formData = await request.formData();
        //     const formDataObject = {};
        //     formData.forEach((value, key) => {
        //         formDataObject[key] = value instanceof File ? `File(${value.name})` : value;
        //     });
        //     logger.info(`Request FormData: ${JSON.stringify(formDataObject)}`);
        // }

        try {
            return await fn(...args);
        } catch (error) {
            logger.error(`FAILED: ${fn.name}`, error);

            let response;

            switch (true) {
                case error instanceof UnsupportedContentTypeError:
                    response = handleUnsupportedContentTypeError(error);
                    break;

                case error instanceof BadRequestError: // New case for BadRequestError
                    response = handleBadRequestError(error);
                    break;

                case error instanceof CryptoError:
                    response = handleCryptoError(error);
                    break;

                case error instanceof z.ZodError:
                    response = handleZodError(error);
                    break;

                case error instanceof mongoose.Error:
                    response = handleMongooseError(error);
                    break;

                default:
                    response = handleGeneralError(error);
                    break;
            }

            return sendResponse(
                response.success,
                response.status,
                response.message,
                configuration?.env === enviornmentsConstants.PRODUCTION
                    ? {}
                    : response.errors,
                {},
                args[0] // Assuming the first argument in `args` is the `Request` object
            );
        } finally {
            logger.info(`COMPLETED: ${fn.name}`);
        }
    };

export default asyncHandler;
