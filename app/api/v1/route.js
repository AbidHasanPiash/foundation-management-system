import httpStatusConstants from '@/constants/httpStatus.constants';

import sendResponse from '@/util/sendResponse';
import asyncHandler from '@/util/asyncHandler';
import configurations from '@/configs/configurations';

const configuration = await configurations();

// Define the GET handler function
const getIndexData = async (request) => {
    const indexData = {
        ...(configuration.api.name && {
            message: `Welcome to ${configuration.api.name} API v1.`,
        }),
        ...(configuration.api.description && {
            description: configuration.api.description,
        }),

        api: {
            ...(configuration.api.version && {
                version: configuration.api.version,
            }),

            endpoints: { ...configuration.api.details.endpoints },

            details: {
                ...(configuration.timeout && {
                    timeout: configuration.timeout,
                }),
                ...(configuration.jsonPayloadLimit && {
                    jsonPayloadLimit: configuration.jsonPayloadLimit,
                }),

                cors: {
                    ...(configuration.cors.allowedMethods && {
                        allowedMethods: configuration.cors.allowedMethods,
                    }),
                    ...(configuration.cors.allowedOrigins && {
                        allowedOrigins: configuration.cors.allowedOrigins,
                    }),
                },

                databases: ['MongoDB', 'Google Drive', 'Local Drive'],

                authentication: {
                    ...(configuration.authentication.maximumLoginAttempts && {
                        maximumLoginAttempts:
                            configuration.authentication.maximumLoginAttempts,
                    }),
                    ...(configuration.authentication
                        .maximumResetPasswordAttempts && {
                        maximumResetPasswordAttempts:
                            configuration.authentication
                                .maximumResetPasswordAttempts,
                    }),
                    ...(configuration.authentication
                        .maximumVerifyEmailAttempts && {
                        maximumVerifyEmailAttempts:
                            configuration.authentication
                                .maximumVerifyEmailAttempts,
                    }),
                    ...(configuration.authentication
                        .maximumChangeEmailAttempts && {
                        maximumChangeEmailAttempts:
                            configuration.authentication
                                .maximumChangeEmailAttempts,
                    }),
                    ...(configuration.authentication
                        .maximumChangeMobileAttempts && {
                        maximumChangeMobileAttempts:
                            configuration.authentication
                                .maximumChangeMobileAttempts,
                    }),
                    ...(configuration.authentication
                        .maximumChangePasswordAttempts && {
                        maximumChangePasswordAttempts:
                            configuration.authentication
                                .maximumChangePasswordAttempts,
                    }),
                    ...(configuration.authentication.maximumActiveSessions && {
                        maximumActiveSessions:
                            configuration.authentication.maximumActiveSessions,
                    }),
                    ...(configuration.authentication.accountLockDuration && {
                        accountLockDuration:
                            configuration.authentication.accountLockDuration,
                    }),
                },

                jwt: {
                    ...(configuration.jwt.accessToken && {
                        accessToken: {
                            secret: configuration.jwt.accessToken.secret,
                            expiration:
                                configuration.jwt.accessToken.expiration,
                        },
                    }),

                    ...(configuration.jwt.refreshToken && {
                        refreshToken: {
                            secret: configuration.jwt.refreshToken.secret,
                            expiration:
                                configuration.jwt.refreshToken.expiration,
                        },
                    }),

                    ...(configuration.jwt.resetPasswordToken && {
                        resetPasswordToken: {
                            secret: configuration.jwt.resetPasswordToken.secret,
                            expiration:
                                configuration.jwt.resetPasswordToken.expiration,
                        },
                    }),

                    ...(configuration.jwt.verifyEmailToken && {
                        verifyEmailToken: {
                            secret: configuration.jwt.verifyEmailToken.secret,
                            expiration:
                                configuration.jwt.verifyEmailToken.expiration,
                        },
                    }),
                },

                rateLimit: {
                    ...(configuration.rateLimit.limit && {
                        limit: configuration.rateLimit.limit,
                    }),
                    ...(configuration.rateLimit.windowMs && {
                        windowMs: configuration.rateLimit.windowMs,
                    }),
                    ...(configuration.rateLimit.headers && {
                        headers: configuration.rateLimit.headers,
                    }),
                },

                cookies: {
                    ...(configuration.cookies.secure && {
                        secure: configuration.cookies.secure,
                    }),
                    ...(configuration.cookies.sameSite && {
                        sameSite: configuration.cookies.sameSite,
                    }),
                    ...(configuration.cookies.httpOnly && {
                        httpOnly: configuration.cookies.httpOnly,
                    }),
                    ...(configuration.cookies.maxAge && {
                        maxAge: configuration.cookies.maxAge,
                    }),
                },

                cache: {
                    ...(configuration.cache.maxAge && {
                        maxAge: configuration.cache.maxAge,
                    }),
                },
            },
        },
    };

    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Request successful.',
        indexData,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(getIndexData);
