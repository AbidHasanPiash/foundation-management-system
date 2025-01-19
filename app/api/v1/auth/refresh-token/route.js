import mongodb from '@/lib/mongodb';
import authUtilities from '@/app/api/v1/auth/auth.utilities';

import asyncHandler from '@/util/asyncHandler';
import { encryptData } from '@/util/crypto';
import createAuthenticationToken from '@/util/createAuthenticationToken';
import validateToken from '@/util/validateToken';

const handleRefreshToken = async (request) => {
    // Check if the "membership" type already exists in MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request, 'refresh');
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Generate authentication token
    const userTokenData = {
        _id: authResult?.user?._id,
        deviceType: authResult?.user?.deviceType,
        userType: authResult?.user?.userType,
    };

    const { accessToken, refreshToken } =
        await createAuthenticationToken(userTokenData);

    console.log(accessToken);
    console.log(refreshToken);

    // Encrypt the token for response
    const returnData = {
        accessToken: encryptData(accessToken),
        refreshToken: encryptData(refreshToken),
    };

    // Return success response
    return authUtilities.authorizedResponse('Authorized.', returnData, request);
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleRefreshToken);
