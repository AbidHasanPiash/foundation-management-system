import axios from 'axios';
import apiConfig from '@/configs/apiConfig';
import { toast } from 'sonner';
import { getRefreshTokenFromCookie, getTokenFromCookie, logout } from './auth';
import { setCookie } from 'cookies-next';
import appConfig from '@/configs/appConfig';

const axiosInstance = axios.create({
    baseURL: apiConfig?.BASE_URL,
    timeout: 30000,
    headers: {
        'X-Site-Identifier':
            typeof window === 'undefined'
                ? process.env.AUTH_X_SITE_IDENTIFIER // Server-side
                : process.env.NEXT_PUBLIC_AUTH_X_SITE_IDENTIFIER, // Client-side
    },
});

const refreshAxiosInstance = axios.create({
    baseURL: apiConfig?.BASE_URL,
    timeout: 15000,
    headers: {
        'X-Site-Identifier':
            typeof window === 'undefined'
                ? process.env.AUTH_X_SITE_IDENTIFIER // Server-side
                : process.env.NEXT_PUBLIC_AUTH_X_SITE_IDENTIFIER, // Client-side
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = getTokenFromCookie();
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

refreshAxiosInstance.interceptors.request.use(
    async (config) => {
        const refreshToken = getRefreshTokenFromCookie();
        if (refreshToken)
            config.headers['Authorization'] = `Bearer ${refreshToken}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const getMessageFromResponse = (response) => {
    if (response?.data?.message) {
        return response.data.message;
    }

    // Fallback if the "message" field is not present
    return 'No response from server';
};

export const handleAxiosError = (error) => {
    if (axios.isCancel(error)) {
        toast.warning('Request was canceled.');
        return;
    }

    if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please try again.');
        return; // Stop further execution
    }

    if (error.response) {
        const code = error.response.status;
        const errorMessage =
            error.response?.data?.data?.message ||
            error.response?.data?.message;

        if (code === 401) {
            logout(true);
        }

        if (code === 404) {
            return []; // Handle 404 differently, return empty array
        }

        toast.error(`Server error: ${code} - ${errorMessage}`);
    } else if (error.request) {
        toast.error('Network error: No response received from server.');
    } else {
        toast.error(`Axios error: ${error.message}`);
    }

    throw error; // Propagate the error for further handling
};

export const handleAxiosErrorAsServer = (error) => {
    if (axios.isCancel(error)) {
        console.warn('Request was canceled.');
        return null;
    }

    if (error.code === 'ECONNABORTED') {
        console.error('Request timed out. Please try again later.');
        return null; // Stop further execution
    }

    if (error.response) {
        const code = error.response.status;
        const errorMessage = error.response?.data?.message;

        if (code === 404) {
            console.warn(
                `Resource not found (404): ${errorMessage || 'No additional message'}`
            );
            return null; // Return null for missing data
        } else {
            console.error(`Server error: ${code} - ${errorMessage}`);
            return null;
        }
    } else if (error.request) {
        console.error('Network error: No response received from server.');
    } else {
        console.error(`Axios error: ${error.message}`);
    }

    throw error; // Propagate error if necessary
};

export async function fetchData(endpoint) {
    try {
        const response = await axiosInstance.get(endpoint);
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function fetchDataAsServer(endpoint) {
    try {
        const config = {
            headers: {
                'X-Site-Identifier':
                    'U2FsdGVkX19CrvanLaGNMpKUHnpq/NMQW4CGQyxaOSc=',
            },
        };
        const response = await axiosInstance.get(endpoint, config);
        return response?.data?.data;
    } catch (error) {
        handleAxiosErrorAsServer(error);
    }
}

export async function postData(endpoint, data, isFileRequest = false) {
    try {
        const isFormData = data instanceof FormData;
        const requestData = isFormData ? data : JSON.stringify({ ...data });

        const headers = isFormData
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' };

        // If the request is for a file, we set the responseType to 'blob'
        const config = isFileRequest
            ? { headers, responseType: 'blob' }
            : { headers };

        const response = await axiosInstance.post(
            endpoint,
            requestData,
            config
        );

        // If it's a file request, we don't return a success toast, just return the file
        if (isFileRequest) {
            return response.data; // This will be the Blob
        }

        const message = getMessageFromResponse(response);
        toast.success(message);
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function updateData(endpoint, data) {
    try {
        const isFormData = data instanceof FormData;
        const requestData = isFormData ? data : JSON.stringify({ ...data });

        const headers = isFormData
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' };

        const response = await axiosInstance.patch(endpoint, requestData, {
            headers,
        });

        const message = getMessageFromResponse(response);
        toast.success(message);
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function deleteData(endpoint, id) {
    const url = endpoint + id;
    try {
        const response = await axiosInstance.delete(url);

        const message = getMessageFromResponse(response);
        toast.success(message);
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

async function axiosRefreshToken() {
    const refreshToken = getRefreshTokenFromCookie();
    if (!refreshToken) return;

    try {
        const response = await refreshAxiosInstance.get(
            apiConfig.REFRESH_TOKEN
        );
        const { accessToken, refreshToken: newRefreshToken } =
            response.data?.data;

        if (accessToken)
            setCookie(appConfig.CurrentUserToken, accessToken, { path: '/' });
        if (newRefreshToken)
            setCookie(appConfig.CurrentUserRefToken, newRefreshToken, {
                path: '/',
            });
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        handleAxiosError(error);
        throw error;
    }
}

axiosRefreshToken();
setInterval(axiosRefreshToken, 1 * 60 * 1000);

export default axiosInstance;
