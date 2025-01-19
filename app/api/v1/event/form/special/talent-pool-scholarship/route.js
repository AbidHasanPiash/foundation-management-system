import serviceShared from '@/shared/service.shared';
import formSpecialTalentPoolScholarshipModel from '@/app/api/v1/event/form/special/talent-pool-scholarship/form.special.talentPoolScholarship.model';

import asyncHandler from '@/util/asyncHandler';

// Named export for the GET request handler
const handleGetSpecialFormList = async (request, context) => {
    const pipeline = [
        { $match: {} }, // Find document by category
        {
            $project: {
                _id: 1,
                formCode: 1,
                slNo: 1,
                formTitle: 1,
                formName: 1,
                scholarshipType: 1,
                scholarshipAmount: 1,
                note: 1,
                contact: 1,
                email: 1,
                isActive: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ];

    return serviceShared.fetchEntryList(
        formSpecialTalentPoolScholarshipModel,
        pipeline,
        'talent pool scholarships form',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetSpecialFormList);
