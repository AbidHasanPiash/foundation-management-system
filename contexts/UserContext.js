'use client';
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import appConfig from '@/configs/appConfig';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { decryptData } from '@/util/crypto.client';

// Create a context
const UserContext = createContext(null);

// Custom hook to use the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// UserProvider component to wrap your app and provide the user data
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Function to update user data (used after login)
    const updateUser = useCallback(() => {
        try {
            const token = getCookie(appConfig?.CurrentUserToken);
            if (!token) {
                console.warn('No token found');
                setUser(null);
                return;
            }

            const decryptedToken = decryptData(token);
            if (decryptedToken) {
                const decodedToken = jwt.decode(decryptedToken);
                const userData = decodedToken?.currentUser;
                setUser(userData || null);
            } else {
                console.error('Decryption failed');
                setUser(null);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setUser(null);
        }
    }, []);

    // Initially set the user when the app loads
    useEffect(() => {
        updateUser();
    }, [updateUser]);

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
