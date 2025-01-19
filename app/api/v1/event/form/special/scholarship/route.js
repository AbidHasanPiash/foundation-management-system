import serviceShared from '@/shared/service.shared';
import FormSpecialScholarshipModel from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.model';

import asyncHandler from '@/util/asyncHandler';
import formSpecialScholarshipPipeline from '@/app/api/v1/event/form/special/scholarship/form.special.scholarship.pipeline';

// Named export for the GET request handler
const handleGetSpecialFormList = async (request, context) => {
    const filter = { lastDate: { $gte: new Date() } }; // Add filters if needed
    const projection = {};
    const pipeline = formSpecialScholarshipPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        FormSpecialScholarshipModel,
        pipeline,
        'scholarship form',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetSpecialFormList);
