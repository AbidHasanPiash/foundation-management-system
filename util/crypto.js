import CryptoJS from 'crypto-js';

import { CryptoError } from '@/util/asyncHandler';

const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;

export function encryptData(data) {
    if (!SECRET_KEY) {
        throw new Error('Encryption secret key is missing.');
    }
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export function decryptData(data) {
    if (!SECRET_KEY) {
        throw new Error('Decryption secret key is missing.');
    }

    try {
        const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedData) {
            throw new CryptoError('Bad encrypted data.');
        }

        return decryptedData;
    } catch (error) {
        throw new CryptoError('Bad encrypted data.');
    }
}
