import serviceShared from '@/shared/service.shared';
import FormSpecialEligibleInstituteModel from '@/app/api/v1/event/form/special/scholarship/eligible/institute/form.special.eligible.institute.model';

import asyncHandler from '@/util/asyncHandler';

// Named export for the GET request handler
const handleGetEligibleInstituteList = async (request, context) => {
    const pipeline = [
        { $match: {} }, // Find document by category
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

    return serviceShared.fetchEntryList(
        FormSpecialEligibleInstituteModel,
        pipeline,
        'scholarship form',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetEligibleInstituteList);
