import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import configurations from '@/configs/configurations';

const configuration = await configurations();

const createAuthenticationToken = async (userDetails) => {
    try {
        const tokenDetails = {
            tokenId: uuidv4(),
            expiry: new Date(
                Date.now() + configuration.jwt.accessToken.expiration
            ),
            currentUser: { ...userDetails },
        };

        const accessTokenDetails = {
            type: 'access',
            ...tokenDetails,
        };

        const refreshTokenDetails = {
            type: 'refresh',
            ...tokenDetails,
        };

        const accessToken = jwt.sign(
            accessTokenDetails,
            configuration.jwt.accessToken.secret,
            {
                expiresIn: `${configuration.jwt.accessToken.expiration}m`,
            }
        );

        const refreshToken = jwt.sign(
            refreshTokenDetails,
            configuration.jwt.refreshToken.secret,
            {
                expiresIn: `${configuration.jwt.refreshToken.expiration}m`,
            }
        );

        return { accessToken, refreshToken, tokenDetails };
    } catch (error) {
        return error;
    }
};

export default createAuthenticationToken;
