import schemaShared from '@/shared/schema.shared';
import serviceShared from '@/shared/service.shared';
import FormSpecialEligibleInstituteModel from '@/app/api/v1/event/form/special/scholarship/eligible/institute/form.special.eligible.institute.model';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetEligibleInstituteById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    // Define the aggregation pipeline using the validated id
    const pipeline = [
        { $match: { _id: convertToObjectId(userInput?.id) } }, // Find document by id
        {
            $project: {
                _id: 1,
                name: 1,
                address: 1,
                contactPerson: 1,
                contactNo: 1,
                headOfInstitute: 1,
                headOfInstituteNumber: 1,
            },
        },
    ];

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        FormSpecialEligibleInstituteModel,
        pipeline,
        'Eligible institute',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetEligibleInstituteById);
