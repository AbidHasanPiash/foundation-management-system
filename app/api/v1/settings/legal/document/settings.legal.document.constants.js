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
    mimeTypesConstants.PDF,
];
const fileFieldName = 'document';
const maxFileSize = 5 * 1024 * 1024; // 5 MB

const settingsLegalDocumentConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    fileFieldName,
    maxFileSize,
};

export default settingsLegalDocumentConstants;
