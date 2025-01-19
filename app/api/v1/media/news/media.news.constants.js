import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

const allowedContentTypes = [
    contentTypesConstants.FORM_DATA,
    contentTypesConstants.X_WWW_FORM_URLENCODED,
];
const allowedMimeTypes = {
    banner: [
        mimeTypesConstants.JPEG,
        mimeTypesConstants.JPG,
        mimeTypesConstants.PNG,
        mimeTypesConstants.GIF,
    ],
    files: [
        mimeTypesConstants.JPEG,
        mimeTypesConstants.JPG,
        mimeTypesConstants.PNG,
        mimeTypesConstants.GIF,
        mimeTypesConstants.PDF,
    ],
};
const fileFieldName = {
    banner: 'banner',
    files: 'files',
};

const allowedBannerFileSize = 5 * 1024 * 1024; // 5 MB max size
const allowedFileSize = 5 * 1024 * 1024; // 5 MB max size

const mediaNewsConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    fileFieldName,
    allowedBannerFileSize,
    allowedFileSize,
};

export default mediaNewsConstants;
