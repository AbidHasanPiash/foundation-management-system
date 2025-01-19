import mongodb from '@/lib/mongodb';
import FormSpecialScholarshipModel from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.model';
import httpStatusConstants from '@/constants/httpStatus.constants';
import formSpecialScholarshipConstants from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.constants';
import formSpecialScholarshipSchema from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.schema';
import formSpecialConstants from '@/app/api/v1/event/form/special/form.special.constants';
import localFileOperations from '@/util/localFileOperations';
import formSpecialTalentPoolScholarshipConstants from '@/app/api/v1/event/form/special/talent-pool-scholarship/form.special.talentPoolScholarship.constants';
import StatusModel from '@/app/api/v1/status/status.model';
import statusConstants from '@/app/api/v1/status/status.constants';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import getNextSequence from '@/util/getNextSequence';

// Named export for the PATCH request handler
const handleSubmitFormSpecialScholarshipData = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        formSpecialScholarshipConstants.submitDataAllowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB
    await mongodb.connect();

    // Parse and validate form data for creation
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        formSpecialScholarshipSchema.postData
    );

    // Check if the special form entry exists
    const existingSpecialFormData = await FormSpecialScholarshipModel.findOne({
        _id: userInput?.id,
    });
    if (!existingSpecialFormData) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Scholarship form entry with ID "${userInput?.id}" not found.`,
            {},
            {},
            request
        );
    }

    // Upload file and generate link
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        userInput[formSpecialTalentPoolScholarshipConstants.fileFieldName][0]
    );

    // Assign a serial number to the new form data entry
    userInput.slNo = await getNextSequence(
        `${formSpecialConstants.formType.scholarship}-data`
    );

    // Assign the file ID and link to the image field
    userInput.image = { id: fileId, link: fileLink };

    // Add the new form data to the data array within the existing document
    const updatedDocument = await FormSpecialScholarshipModel.findOneAndUpdate(
        { _id: userInput?.id },
        { $push: { data: userInput } }, // Adds the new form data to the data array
        {
            new: true, // Return the updated document
            projection: {
                _id: 1,
                statusId: 1,
                slNo: 1,
                formTitle: 1,
                formName: 1,
                venue: 1,
                eligibleSchools: 1,
                exam: 1,
                note: 1,
                contact: 1,
                email: 1,
                data: { $slice: -1 }, // Return only the newly added item in the data array
            },
        }
    ).lean();

    if (!updatedDocument) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to submit scholarship form entry with ID "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    // Extract the newly added form data
    const newlySubmittedData = updatedDocument.data[0]; // Since $slice returns an array, access the first element

    // Send a success response with the entire updated document and the newly submitted data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Scholarship form entry with ID "${userInput?.id}" submitted successfully.`,
        {
            ...updatedDocument,
            data: newlySubmittedData,
        },
        {},
        request
    );
};

// Named export for the GET request handler
const handleGetAllFormSpecialScholarshipData = async (request, context) => {
    // Connect to MongoDB
    await mongodb.connect();

    // Extract ID from the query parameters, if specified
    const { id } = context.params || {};

    // Query to retrieve all data entries
    const query = id ? { _id: id } : {};

    // Fetch the document(s) with only the 'data' field
    const document = await FormSpecialScholarshipModel.findOne(query, {
        data: 1,
    }).lean();

    // Check if document was found
    if (!document || !document.data) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `No scholarship form entries found.`,
            {},
            {},
            request
        );
    }

    // Return only the `data` array directly
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Successfully retrieved scholarship form data.`,
        document.data,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleSubmitFormSpecialScholarshipData);

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetAllFormSpecialScholarshipData);
