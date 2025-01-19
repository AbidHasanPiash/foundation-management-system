import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

const allowedTypes = ['mission', 'vision', 'aim-objective'];
const allowedContentTypes = [contentTypesConstants.JSON];
const allowedMimeTypes = [
    mimeTypesConstants.JPEG,
    mimeTypesConstants.JPG,
    mimeTypesConstants.PNG,
    mimeTypesConstants.GIF,
];

const mediaVideoConstants = {
    allowedTypes,
    allowedContentTypes,
    allowedMimeTypes,
};

export default mediaVideoConstants;
