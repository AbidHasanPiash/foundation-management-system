import httpStatusConstants from '@/constants/httpStatus.constants';

// Define a custom error class for invalid user data
export class InvalidUserDataError extends Error {
    constructor(message = 'Invalid user data provided.') {
        super(message);
        this.name = 'InvalidUserDataError';
        this.status = httpStatusConstants.BAD_REQUEST;
    }
}
