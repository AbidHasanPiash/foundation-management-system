import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

const categories = {
    about: 'about',
    membership: 'membership',
};

const types = {
    mission: 'mission',
    vision: 'vision',
    aimObjective: 'aim-objective',

    aboutMembership: 'about-membership',
    membershipCriteria: 'membership-criteria',
    membershipFee: 'membership-fee',
};

const allowedCategories = Object.values(categories);
const allowedTypes = Object.values(types);
const allowedContentTypes = [
    contentTypesConstants.FORM_DATA,
    contentTypesConstants.X_WWW_FORM_URLENCODED,
];
const allowedMimeTypes = [
    mimeTypesConstants.JPEG,
    mimeTypesConstants.JPG,
    mimeTypesConstants.PNG,
    mimeTypesConstants.GIF,
];
const fileFieldName = 'banner';

const allowedBannerFileSize = 5 * 1024 * 1024;

const aboutConstants = {
    allowedContentTypes,
    categories,
    types,
    allowedCategories,
    allowedTypes,
    allowedMimeTypes,
    fileFieldName,
    allowedBannerFileSize,
};

export default aboutConstants;
