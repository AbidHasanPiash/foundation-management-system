import { v4 as uuidv4 } from 'uuid';

const generateUniqueID = (prefix = 'undefined') => {
    // Extract the first 6 characters from the random UUID as the suffix
    const randomSuffix = uuidv4().substring(0, 6);

    // Combine the prefix and random suffix to create the unique ID
    return `${prefix}-${randomSuffix}`;
};

export default generateUniqueID;
