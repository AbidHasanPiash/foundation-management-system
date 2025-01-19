import CryptoJS from 'crypto-js';

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
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        throw new Error('Bad encrypted data.');
    }
}
