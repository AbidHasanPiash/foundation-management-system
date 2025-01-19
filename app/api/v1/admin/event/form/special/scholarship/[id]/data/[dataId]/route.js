import mongodb from '@/lib/mongodb';
import FormSpecialScholarshipModel from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.model';
import httpStatusConstants from '@/constants/httpStatus.constants';
import formSpecialScholarshipConstants from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.constants';
import formSpecialScholarshipSchema from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.schema';
import StatusModel from '@/app/api/v1/status/status.model';
import statusConstants from '@/app/api/v1/status/status.constants';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import validateToken from '@/util/validateToken';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';

const handleSubmitFormSpecialScholarshipData = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        formSpecialScholarshipConstants.updateSubmittedDataAllowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data for updating
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'update',
        formSpecialScholarshipSchema.updatePostDataStatus
    );

    // Check if the main form document and specific data entry exist
    const { id, dataId, statusId } = userInput;

    if (
        !(await StatusModel.exists({
            category: statusConstants.categories.event,
            _id: statusId,
        }))
    ) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Talent pool scholarship data entry with status ID "${statusId}" not found.`,
            {},
            {},
            request
        );
    }

    if (userInput.statusId) userInput.statusId = convertToObjectId(statusId);
    if (userInput.dataId) userInput.dataId = convertToObjectId(dataId);

    // Update only the statusId of the specified entry in the data array
    const updateResult = await FormSpecialScholarshipModel.findOneAndUpdate(
        { _id: id, 'data._id': dataId },
        { $set: { 'data.$[elem].statusId': statusId } },
        {
            arrayFilters: [{ 'elem._id': dataId }], // Apply filter to match specific data entry
            new: true, // Return the updated document
        }
    );

    if (!updateResult) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update the status of the submitted scholarship form data entry with ID "${dataId}" and statusId: "${statusId}".`,
            {},
            {},
            request
        );
    }

    // Retrieve the updated data entry by re-fetching it
    const updatedDocument = await FormSpecialScholarshipModel.findOne(
        { _id: id },
        {
            _id: 1,
            slNo: 1,
            formTitle: 1,
            formName: 1,
            venue: 1,
            eligibleSchools: 1,
            exam: 1,
            note: 1,
            contact: 1,
            email: 1,
            data: { $elemMatch: { _id: dataId } }, // Fetch only the updated data entry
        }
    ).lean();

    if (
        !updatedDocument ||
        !updatedDocument.data ||
        updatedDocument.data.length === 0
    ) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to retrieve updated data entry with ID "${dataId}".`,
            {},
            {},
            request
        );
    }

    // Send a success response with the updated data entry
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Successfully updated submitted form data status with ID "${dataId}" in form "${id}".`,
        { ...updatedDocument, data: updatedDocument.data[0] },
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleSubmitFormSpecialScholarshipData);
