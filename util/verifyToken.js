import jwt from 'jsonwebtoken';

// import configuration from '@/configs/configuration.js';
import configurations from '@/configs/configurations';

const configuration = await configurations();

const verifyToken = async (token, type = 'access') => {
    try {
        if (type === 'refresh') {
            return await jwt.verify(
                token,
                configuration.jwt.refreshToken.secret
            );
        } else {
            return await jwt.verify(
                token,
                configuration.jwt.accessToken.secret
            );
        }
    } catch (error) {
        return false;
    }
};

export default verifyToken;
