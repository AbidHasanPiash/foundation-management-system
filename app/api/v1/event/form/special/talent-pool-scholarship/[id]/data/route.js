import mongodb from '@/lib/mongodb';
import httpStatusConstants from '@/constants/httpStatus.constants';
import formSpecialConstants from '@/app/api/v1/event/form/special/form.special.constants';
import formSpecialTalentPoolScholarshipConstants from '@/app/api/v1/event/form/special/talent-pool-scholarship/form.special.talentPoolScholarship.constants';
import formSpecialTalentPoolScholarshipSchema from '@/app/api/v1/event/form/special/talent-pool-scholarship/form.special.talentPoolScholarship.schema';
import FormSpecialTalentPoolScholarshipModel from '@/app/api/v1/event/form/special/talent-pool-scholarship/form.special.talentPoolScholarship.model';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import getNextSequence from '@/util/getNextSequence';

// Named export for the PATCH request handler
const handleSubmitFormSpecialTalentPoolScholarshipData = async (
    request,
    context
) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        formSpecialTalentPoolScholarshipConstants.submitDataAllowedContentTypes
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
        formSpecialTalentPoolScholarshipSchema.postData
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
            `Talent pool scholarship form entry with ID "${userInput?.id}" not found.`,
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
        `${formSpecialConstants.formType.talentPoolScholarship}-data`
    );

    // Assign the file ID and link to the image field
    userInput.image = { id: fileId, link: fileLink };

    console.log(userInput);

    // Add the new form data to the data array within the existing document
    const updatedDocument =
        await FormSpecialTalentPoolScholarshipModel.findOneAndUpdate(
            { _id: userInput?.id },
            { $push: { data: userInput } }, // Adds the new form data to the data array
            {
                new: true, // Return the updated document
                projection: {
                    _id: 1,
                    slNo: 1,
                    formTitle: 1,
                    formName: 1,
                    scholarshipType: 1,
                    scholarshipAmount: 1,
                    note: 1,
                    contact: 1,
                    email: 1,
                    data: { $slice: -1 }, // Return only the newly added item in the data array
                },
            }
        ).lean();

    console.log(userInput);

    if (
        !updatedDocument ||
        !updatedDocument.data ||
        updatedDocument.data.length === 0
    ) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to submit talent pool scholarship form entry with ID "${userInput?.id}".`,
            {},
            {},
            request
        );
    }

    // Extract the newly added form data
    const newlySubmittedData = updatedDocument.data[0];

    // Send a success response with the entire updated document and the newly submitted data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Talent pool scholarship form entry with ID "${userInput?.id}" submitted successfully.`,
        {
            ...updatedDocument,
            data: newlySubmittedData,
        },
        {},
        request
    );
};

// Named export for the GET request handler
const handleGetAllFormSpecialTalentPoolScholarshipData = async (
    request,
    context
) => {
    // Connect to MongoDB
    await mongodb.connect();

    // Extract ID from the query parameters, if specified
    const { id } = context.params || {};

    // Query to retrieve all data entries
    const query = id ? { _id: id } : {};

    // Fetch the document(s) with only the 'data' field
    const document = await FormSpecialTalentPoolScholarshipModel.findOne(
        query,
        { data: 1 }
    ).lean();

    // Check if document was found
    if (!document || !document.data) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `No talent pool scholarship form entries found.`,
            {},
            {},
            request
        );
    }

    // Return only the `data` array directly
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Successfully retrieved talent pool scholarship form data.`,
        document.data,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(
    handleSubmitFormSpecialTalentPoolScholarshipData
);

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(
    handleGetAllFormSpecialTalentPoolScholarshipData
);
