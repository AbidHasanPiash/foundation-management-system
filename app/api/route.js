import configurations from '@/configs/configurations';
import httpStatusConstants from '@/constants/httpStatus.constants';

import sendResponse from '@/util/sendResponse';
import asyncHandler from '@/util/asyncHandler';

const configuration = await configurations();

// Define the GET handler function
const getIndexData = async (request) => {
    const indexData = {
        ...(configuration.api.name && {
            message: `Welcome to ${configuration.api.name} API.`,
        }),
        ...(configuration.api.description && {
            description: configuration.api.description,
        }),

        engines: {
            ...(configuration.api.engines?.node && {
                node: configuration.api.engines.node,
            }),
            ...(configuration.api.engines?.npm && {
                npm: configuration.api.engines.npm,
            }),
        },

        api: {
            ...(configuration.api.version && {
                version: configuration.api.version,
            }),
            ...(configuration.api.license && {
                license: configuration.api.license,
            }),

            details: {
                ...(configuration.api.details.repository && {
                    repository: configuration.api.details.repository,
                }),
                ...(configuration.api.details.homepage && {
                    homepage: configuration.api.details.homepage,
                }),
                ...(configuration.api.details.issues && {
                    issues: configuration.api.details.issues,
                }),
                ...(configuration.api.details.bugs && {
                    bugs: configuration.api.details.bugs,
                }),
                ...(configuration.api.details.termsOfService && {
                    termsOfService: configuration.api.details.termsOfService,
                }),

                documentation: {
                    ...(configuration.api.details.documentation.docs && {
                        docs: configuration.api.details.documentation.docs,
                    }),
                    ...(configuration.api.details.documentation.swagger && {
                        swagger:
                            configuration.api.details.documentation.swagger,
                    }),
                    ...(configuration.api.details.documentation.tutorials && {
                        tutorials:
                            configuration.api.details.documentation.tutorials,
                    }),
                },

                endpoints: { ...configuration.api.details.endpoints },
            },
        },

        contact: {
            owner: {
                ...(configuration.contact.owner.email && {
                    email: configuration.contact.owner.email,
                }),
                ...(configuration.contact.owner.mobile && {
                    mobile: configuration.contact.owner.mobile,
                }),
            },

            support: {
                ...(configuration.contact.support.email && {
                    email: configuration.contact.support.email,
                }),
                ...(configuration.contact.support.mobile && {
                    mobile: configuration.contact.support.mobile,
                }),
            },

            admin: {
                ...(configuration.contact.admin?.email && {
                    email: configuration.contact.admin.email,
                }),
                ...(configuration.contact.admin?.mobile && {
                    mobile: configuration.contact.admin.mobile,
                }),
            },

            social: {
                ...(configuration.contact.social.linkedIn && {
                    linkedIn: configuration.contact.social.linkedIn,
                }),
                ...(configuration.contact.social.gitHub && {
                    gitHub: configuration.contact.social.gitHub,
                }),
                ...(configuration.contact.social.x && {
                    x: configuration.contact.social.x,
                }),
                ...(configuration.contact.social.facebook && {
                    facebook: configuration.contact.social.facebook,
                }),
                ...(configuration.contact.social.instagram && {
                    instagram: configuration.contact.social.instagram,
                }),
            },

            author: {
                ...(configuration.author.name && {
                    name: configuration.author.name,
                }),

                contact: {
                    ...(configuration.author.contact.email && {
                        email: configuration.author.contact.email,
                    }),
                    ...(configuration.author.contact.mobile && {
                        mobile: configuration.author.contact.mobile,
                    }),
                },

                social: {
                    ...(configuration.author.social.linkedIn && {
                        linkedIn: configuration.author.social.linkedIn,
                    }),
                    ...(configuration.author.social.gitHub && {
                        gitHub: configuration.author.social.gitHub,
                    }),
                    ...(configuration.author.social.x && {
                        x: configuration.author.social.x,
                    }),
                    ...(configuration.author.social.facebook && {
                        facebook: configuration.author.social.facebook,
                    }),
                    ...(configuration.author.social.instagram && {
                        instagram: configuration.author.social.instagram,
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
