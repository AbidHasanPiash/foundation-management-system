import schemaShared from '@/shared/schema.shared';
import serviceShared from '@/shared/service.shared';
import FormSpecialScholarshipModel from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.model';

import asyncHandler from '@/util/asyncHandler';
import convertToObjectId from '@/util/convertToObjectId';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import formSpecialScholarshipPipeline from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetFormSpecialScholarshipById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const filter = { _id: convertToObjectId(userInput?.id) }; // Add filters if needed
    const projection = {};
    const pipeline = formSpecialScholarshipPipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        FormSpecialScholarshipModel,
        pipeline,
        'Scholarship form',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetFormSpecialScholarshipById);
