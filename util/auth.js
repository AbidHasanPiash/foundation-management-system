import appConfig from '@/configs/appConfig';
import { postData } from './axios';
import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next';
import { toast } from 'sonner';
import { decryptData } from './crypto.client';
import { jwtVerify } from 'jose';

const isProduction = process.env.NODE_ENV === 'production';

async function login(data, api) {
    try {
        const response = await postData(api, data);
        const { accessToken, refreshToken } = response;
        if (accessToken)
            setCookie(appConfig?.CurrentUserToken, accessToken, {
                path: '/',
                secure: isProduction,
                sameSite: isProduction ? 'Strict' : 'Lax',
            });
        if (refreshToken)
            setCookie(appConfig?.CurrentUserRefToken, refreshToken, {
                path: '/',
                secure: isProduction,
                sameSite: isProduction ? 'Strict' : 'Lax',
            });

        return response;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            throw new Error('A server error occurred during login.');
        }
    }
}

function logout(direct = false, callback) {
    const performLogout = () => {
        try {
            deleteCookie(appConfig?.CurrentUserToken, { path: '/' });
            deleteCookie(appConfig?.CurrentUserRefToken, { path: '/' });
            if (callback) callback(); // Trigger the callback after successful logout
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    if (direct) {
        performLogout();
    } else {
        toast.warning('Do you want to Sign out?', {
            action: {
                label: 'Yes',
                onClick: performLogout,
            },
        });
    }
}

function getTokenFromCookie() {
    try {
        const token = getCookie(appConfig?.CurrentUserToken);
        return token || null;
    } catch (error) {
        console.error('Error getting token from cookie:', error);
        return null;
    }
}

function getRefreshTokenFromCookie() {
    try {
        const token = getCookie(appConfig?.CurrentUserRefToken);
        return token ? token : null;
    } catch (error) {
        console.error('Error getting token from cookie:', error);
        return null;
    }
}

function setNewTokenToCookie(newToken) {
    if (newToken) {
        setCookie(appConfig?.CurrentUserToken, newToken, {
            path: '/',
            secure: isProduction,
            sameSite: isProduction ? 'Strict' : 'Lax',
        });
    }
}

function isLoggedIn() {
    const token = hasCookie(App.CurrentUserToken);
    return token;
}

async function getTokenPayload(token, type = 'access') {
    // Decode encrypted token first
    const decryptedToken = decryptData(token);

    // Select the correct secret based on the token type
    const secret = new TextEncoder().encode(
        type === 'access'
            ? process?.env?.JWT_ACCESS_TOKEN_SECRET
            : process?.env?.JWT_REFRESH_TOKEN_SECRET
    );

    try {
        const { payload } = await jwtVerify(decryptedToken, secret);
        return payload;
    } catch (error) {
        console.error(`Invalid ${type} token:`, error.message);
        return null; // Return null if the token is invalid
    }
}

export {
    login,
    logout,
    getTokenFromCookie,
    getRefreshTokenFromCookie,
    setNewTokenToCookie,
    isLoggedIn,
    getTokenPayload,
};
