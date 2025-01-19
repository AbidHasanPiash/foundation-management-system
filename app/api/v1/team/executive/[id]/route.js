import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';
import TeamExecutiveModel from '../team.executive.model';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import teamExecutivePipeline from '@/app/api/v1/team/executive/team.executive.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetExecutiveById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const filter = { _id: convertToObjectId(userInput?.id) };
    const projection = {};
    const pipeline = teamExecutivePipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        TeamExecutiveModel,
        pipeline,
        'Executive',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetExecutiveById);
