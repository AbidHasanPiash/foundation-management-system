import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

const allowedTypes = ['mission', 'vision', 'aim-objective'];
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
const fileFieldName = 'image';

const homeCarouselConstants = {
    allowedTypes,
    allowedContentTypes,
    allowedMimeTypes,
    fileFieldName,
};

export default homeCarouselConstants;
