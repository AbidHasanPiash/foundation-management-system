// fileManager.js
import fs from 'fs';
import path from 'path';

// Create an `uploads` directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const uploadFile = async (fileData) => {
    const uniqueFileName = `${Date.now()}-${fileData.originalname}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    try {
        // Write file buffer to the specified path
        await fs.promises.writeFile(filePath, fileData.buffer);
        return { fileId: uniqueFileName, filePath };
    } catch (error) {
        console.error('Error saving file:', error);
        return null;
    }
};

const deleteFile = async (fileId) => {
    const filePath = path.join(uploadsDir, fileId);
    try {
        await fs.promises.unlink(filePath);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

export default {
    uploadFile,
    deleteFile,
};
