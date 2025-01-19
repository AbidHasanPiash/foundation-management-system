import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import formSpecialScholarshipConstants from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.constants';
import formSpecialScholarshipSchema from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.schema';
import FormSpecialScholarshipModel from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.model';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';
import SettingsGeneralModel from '@/app/api/v1/settings/general/settings.general.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import formSpecialScholarshipPipeline from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the PATCH request handler
const handleUpdateFormSpecial = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        formSpecialScholarshipConstants.allowedContentTypes
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
        formSpecialScholarshipSchema.updateSchema
    );

    // Check if the special form entry exists
    const existingSpecialFormData = await FormSpecialScholarshipModel.findById(
        userInput.id
    );
    if (!existingSpecialFormData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Special form entry with ID "${userInput.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Fetch organization details if needed
    const organizationDetails = await SettingsGeneralModel.findOne(
        {},
        {
            _id: 0,
            name: 1,
            description: 1,
            logo: { $ifNull: ['$logo.link', ''] },
            address: 1,
            emails: 1,
            contacts: 1,
            socialLinks: 1,
        }
    ).lean();

    if (!organizationDetails) {
        return sendResponse(
            false,
            httpStatusConstants.BAD_REQUEST,
            'Your organization setup is not completed yet. Please set up your organization.',
            {},
            {},
            request
        );
    }

    if (userInput.lastDate) {
        userInput.lastDate = new Date(userInput.lastDate);
    }

    // Prepare fields to update by filtering out undefined or null values
    const fieldsToUpdate = {};
    for (const [key, value] of Object.entries(userInput)) {
        if (value !== undefined && value !== null) {
            fieldsToUpdate[key] = value;
        }
    }

    // Update the document
    const updatedDocument = await FormSpecialScholarshipModel.findByIdAndUpdate(
        userInput.id,
        { $set: fieldsToUpdate },
        { new: true }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update special form entry with ID "${userInput.id}".`,
            {},
            {},
            request
        );
    }

    const filter = { _id: convertToObjectId(updatedDocument?._id) }; // Add filters if needed
    const projection = {};
    const pipeline = formSpecialScholarshipPipeline(filter, projection);
    const updatedDocumentWithDetails =
        await FormSpecialScholarshipModel.aggregate(pipeline);

    if (!updatedDocumentWithDetails) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to retrieve updated document with details.`,
            {},
            {},
            request
        );
    }

    updatedDocumentWithDetails.organizer = organizationDetails;

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Special form entry with ID "${userInput.id}" updated successfully.`,
        updatedDocumentWithDetails,
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
        FormSpecialScholarshipModel,
        '', // Projection field for file deletion
        `Scholarship form`
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateFormSpecial);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteFormSpecial);
