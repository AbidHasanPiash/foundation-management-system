import schemaShared from '@/shared/schema.shared';
import serviceShared from '@/shared/service.shared';
import FormSpecialTalentPoolScholarshipModel from '@/app/api/v1/event/form/special/talent-pool-scholarship/form.special.talentPoolScholarship.model';

import asyncHandler from '@/util/asyncHandler';
import convertToObjectId from '@/util/convertToObjectId';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetFormSpecialTalentPoolScholarshipById = async (
    request,
    context
) => {
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

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        FormSpecialTalentPoolScholarshipModel,
        pipeline,
        'Talent pool scholarships form',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetFormSpecialTalentPoolScholarshipById);
