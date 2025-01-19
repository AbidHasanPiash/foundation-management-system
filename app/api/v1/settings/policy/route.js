import serviceShared from '@/shared/service.shared';
import SettingsPolicyModel from './settings.policy.model';

import asyncHandler from '@/util/asyncHandler';
import settingsPolicyPipeline from '@/app/api/v1/settings/policy/settings.policy.pipeline';

// Named export for the GET request handler
const handleGetSettingsPolicy = async (request, context) => {
    const filter = {};
    const projection = {};
    const pipeline = settingsPolicyPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        SettingsPolicyModel,
        pipeline,
        'policy',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetSettingsPolicy);
