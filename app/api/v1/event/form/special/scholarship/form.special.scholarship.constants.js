import contentTypesConstants from '@/constants/contentTypes.constants';
import mimeTypesConstants from '@/constants/mimeTypes.constants';

const allowedContentTypes = [contentTypesConstants.JSON];
const submitDataAllowedContentTypes = [contentTypesConstants.FORM_DATA];
const updateSubmittedDataAllowedContentTypes = [contentTypesConstants.JSON];
const allowedMimeTypes = [
    mimeTypesConstants.JPEG,
    mimeTypesConstants.JPG,
    mimeTypesConstants.PNG,
    mimeTypesConstants.GIF,
];
const fileFieldName = 'image';

const formSpecialScholarshipConstants = {
    allowedContentTypes,
    submitDataAllowedContentTypes,
    updateSubmittedDataAllowedContentTypes,
    allowedMimeTypes,
    fileFieldName,
};

export default formSpecialScholarshipConstants;
