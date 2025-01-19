import serviceShared from '@/shared/service.shared';
import TeamExecutiveModel from './team.executive.model';

import asyncHandler from '@/util/asyncHandler';
import convertToObjectId from '@/util/convertToObjectId';
import teamExecutivePipeline from '@/app/api/v1/team/executive/team.executive.pipeline';

// Named export for the GET request handler
const handleGetExecutive = async (request, context) => {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const queryObject = Object.fromEntries(searchParams.entries());

    const { typeId } = queryObject;

    // Build the $match stage dynamically based on query parameters
    let filter = {};
    if (typeId) {
        filter = { typeId: convertToObjectId(typeId) };
    }

    const projection = {};
    const pipeline = teamExecutivePipeline(filter, projection);

    // Fetch data using the pipeline
    return serviceShared.fetchEntryList(
        TeamExecutiveModel,
        pipeline,
        'executive',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetExecutive);
