import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

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

const homeMessageConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    fileFieldName,
};

export default homeMessageConstants;
