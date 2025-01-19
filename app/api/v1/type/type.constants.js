import contentTypesConstants from '@/constants/contentTypes.constants';

const allowedContentTypes = [contentTypesConstants.JSON];

const categories = {
    event: 'event',
    team: 'team',
    member: 'member',
    paymentMethod: 'payment_method',
};

const allowedCategories = Object.values(categories);

const typeConstants = {
    allowedContentTypes,
    categories,
    allowedCategories,
};

export default typeConstants;
