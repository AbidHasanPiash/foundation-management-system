import formSpecialEligibleSchoolConstants from '@/app/api/v1/event/form/special/scholarship/eligible/institute/form.special.eligible.institute.constants';
import mongodb from '@/lib/mongodb';
import formSpecialEligibleSchoolSchema from '@/app/api/v1/event/form/special/scholarship/eligible/institute/form.special.eligible.institute.schema';
import FormSpecialEligibleSchoolModel from '@/app/api/v1/event/form/special/scholarship/eligible/institute/form.special.eligible.institute.model';
import httpStatusConstants from '@/constants/httpStatus.constants';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import validateToken from '@/util/validateToken';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import sendResponse from '@/util/sendResponse';

const { idValidationSchema } = schemaShared;

const handleUpdateEligibleSchoolById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        formSpecialEligibleSchoolConstants.allowedContentTypes
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
        'update',
        formSpecialEligibleSchoolSchema.updateSchema
    );

    // Extract the institute ID and other fields to be updated
    const {
        id,
        name,
        address,
        contactPerson,
        contactNo,
        headOfInstitute,
        headOfInstituteNumber,
    } = userInput;

    // Retrieve the existing institute document by ID
    const existingSchool = await FormSpecialEligibleSchoolModel.findById(id);
    if (!existingSchool) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            'School not found. Please check the ID and try again.',
            {},
            {},
            request
        );
    }

    // Check for uniqueness of name if the name is being updated
    if (name && name !== existingSchool.name) {
        const nameExists = await FormSpecialEligibleSchoolModel.exists({
            name,
        });
        if (nameExists) {
            return sendResponse(
                false,
                httpStatusConstants.CONFLICT,
                `Another school with the name "${name}" already exists.`,
                {},
                {},
                request
            );
        }
    }

    // Construct the update object with only non-null values
    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (address !== undefined) fieldsToUpdate.address = address;
    if (contactPerson !== undefined)
        fieldsToUpdate.contactPerson = contactPerson;
    if (contactNo !== undefined) fieldsToUpdate.contactNo = contactNo;
    if (headOfInstitute !== undefined)
        fieldsToUpdate.headOfInstitute = headOfInstitute;
    if (headOfInstituteNumber !== undefined)
        fieldsToUpdate.headOfInstituteNumber = headOfInstituteNumber;

    // Update the document in MongoDB
    const updatedSchool =
        await FormSpecialEligibleSchoolModel.findByIdAndUpdate(
            id,
            { $set: fieldsToUpdate },
            {
                new: true,
                projection: {
                    _id: 1,
                    name: 1,
                    address: 1,
                    contactPerson: 1,
                    contactNo: 1,
                    headOfInstitute: 1,
                    headOfInstituteNumber: 1,
                },
            }
        ).lean();

    if (!updatedSchool) {
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            'Failed to update the eligible school entry.',
            {},
            {},
            request
        );
    }

    // Send a success response with the updated document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        `Eligible school entry with ID "${id}" updated successfully.`,
        updatedSchool,
        {},
        request
    );
};

// Named export for the POST request handler
const handleDeleteEligibleSchool = async (request, context) => {
    return serviceShared.deleteEntry(
        request,
        context,
        idValidationSchema,
        FormSpecialEligibleSchoolModel,
        '', // Projection field for file deletion
        `Eligible school`
    );
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateEligibleSchoolById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteEligibleSchool);
