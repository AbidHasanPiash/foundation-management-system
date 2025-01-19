import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import serviceShared from '@/shared/service.shared';
import settingsGeneralModel from '@/app/api/v1/settings/general/settings.general.model';
import formSpecialTalentPoolScholarshipConstants from '@/app/api/v1/event/form/special/talent-pool-scholarship/form.special.talentPoolScholarship.constants';
import formSpecialTalentPoolScholarshipSchema from '@/app/api/v1/event/form/special/talent-pool-scholarship/form.special.talentPoolScholarship.schema';
import FormSpecialTalentPoolScholarshipModel from '@/app/api/v1/event/form/special/talent-pool-scholarship/form.special.talentPoolScholarship.model';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';

const { idValidationSchema } = schemaShared;

// Named export for the PATCH request handler
const handleUpdateFormSpecial = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        formSpecialTalentPoolScholarshipConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB
    await mongodb.connect();

    // Validate admin token
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data for update
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'update',
        formSpecialTalentPoolScholarshipSchema.updateSchema
    );

    // Check if the special form entry exists
    const existingSpecialFormData =
        await FormSpecialTalentPoolScholarshipModel.findOne({
            _id: userInput?.id,
        });
    if (!existingSpecialFormData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Special form entry with ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Fetch organization details if needed
    const pipeline = [
        { $match: {} },
        {
            $project: {
                _id: 0,
                name: 1,
                description: 1,
                logo: { $ifNull: ['$logo.link', ''] },
                address: 1,
                emails: 1,
                contacts: 1,
                socialLinks: 1,
            },
        },
    ];
    const organizationDetails = await settingsGeneralModel.aggregate(pipeline);
    if (!organizationDetails[0]) {
        return sendResponse(
            false,
            httpStatusConstants.BAD_REQUEST,
            'Your organization setup is not completed yet. Please setup your organization.',
            {},
            {},
            request
        );
    }

    // Prepare fields to update
    const fieldsToUpdate = Object.keys(userInput).reduce((acc, key) => {
        if (userInput[key] !== undefined && userInput[key] !== null) {
            acc[key] = userInput[key];
        }
        return acc;
    }, {});

    // Update document with filtered data and attach organization details
    const updatedDocument =
        await FormSpecialTalentPoolScholarshipModel.findOneAndUpdate(
            { _id: userInput?.id },
            { $set: { ...fieldsToUpdate, organizer: organizationDetails[0] } },
            {
                new: true,
                projection: {
                    _id: 1,
                    formCode: 1,
                    slNo: 1,
                    formTitle: 1,
                    formName: 1,
                    scholarshipType: 1,
                    scholarshipAmount: 1,
                    note: 1,
                    contact: 1,
                    email: 1,
                    isActive: 1,
                },
            }
        ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update special form entry with ID "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Special form entry with ID "${userInput?.id}" updated successfully.`,
        updatedDocument,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteFormSpecial = async (request, context) => {
    return serviceShared.deleteEntry(
        request,
        context,
        idValidationSchema,
        FormSpecialTalentPoolScholarshipModel,
        '', // Projection field for file deletion
        `Talent pool scholarship form`
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateFormSpecial);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteFormSpecial);
