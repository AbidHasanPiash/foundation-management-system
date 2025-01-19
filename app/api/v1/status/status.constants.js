import contentTypesConstants from '@/constants/contentTypes.constants';

const allowedContentTypes = [contentTypesConstants.JSON];

const categories = {
    event: 'event',
    eventFormScholarship: 'event_form_scholarship',
    eventFormTalentPoolScholarship: 'event_form_talend_pool_scholarship',
    team: 'team',
    member: 'member',
    paymentMethod: 'payment_method',
};

const allowedCategories = Object.values(categories);

const statusConstants = {
    allowedContentTypes,
    categories,
    allowedCategories,
};

export default statusConstants;
