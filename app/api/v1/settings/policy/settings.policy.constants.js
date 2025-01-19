import contentTypesConstants from '@/constants/contentTypes.constants';

const allowedTypes = ['privacy', 'cookies', 'terms-and-conditions'];
const allowedContentTypes = [contentTypesConstants.JSON];

const settingsPolicyConstants = {
    allowedTypes,
    allowedContentTypes,
};

export default settingsPolicyConstants;
