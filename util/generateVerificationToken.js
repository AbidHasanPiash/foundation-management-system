import crypto from 'crypto';

import createHashedPassword from '@/util/createHashedPassword';

const generateVerificationToken = async () => {
    const token = crypto.randomBytes(20).toString('hex');
    const verifyToken = await createHashedPassword(token);

    return {
        verifyToken,
        token,
    };
};

export default generateVerificationToken;
