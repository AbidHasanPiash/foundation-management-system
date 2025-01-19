import serviceShared from '@/shared/service.shared';
import settingsPolicySchema from '@/app/api/v1/settings/policy/settings.policy.schema';
import SettingsPolicyModel from '../settings.policy.model';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import settingsPolicyPipeline from '@/app/api/v1/settings/policy/settings.policy.pipeline';

// Named export for the GET request handler
const handleGetSettingsPolicyByType = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        settingsPolicySchema.typeSchema
    );

    const filter = { type: userInput?.type };
    const projection = {};
    const pipeline = settingsPolicyPipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        SettingsPolicyModel,
        pipeline,
        'Policy',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetSettingsPolicyByType);
