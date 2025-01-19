import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

import logger from '@/lib/logger';

import generateFileLink from './generateFileLink';
import { BadRequestError } from '@/util/asyncHandler';

const generateUniqueFileName = (name) => {
    const fileId = uuidv4(); // Generate a unique file ID
    const originalExtension = path.extname(name); // Get the original file extension
    const sanitizedOriginalName = path
        .basename(name, originalExtension)
        .replaceAll(' ', '_'); // Get the base name without extension

    return `${fileId}_${sanitizedOriginalName}${originalExtension}`;
};

// Convert the file data to a Buffer
const createFileBuffer = async (file) => Buffer.from(await file.arrayBuffer());

const uploadFile = async (request, file) => {
    if (!file) throw new BadRequestError('No files received.');

    const buffer = await createFileBuffer(file);
    const fileName = generateUniqueFileName(file.name);
    const filePath = `public/assets/${fileName}`;
    const fullDirPath = path.join(process.cwd(), 'public/assets');

    // Ensure the directory exists (create it if it doesn't)
    await fs.mkdir(fullDirPath, { recursive: true });

    // Write the file to the specified directory with the new filename
    await fs.writeFile(path.join(process.cwd(), filePath), buffer);

    const fileLink = generateFileLink(request, `/assets/${fileName}`);

    return { fileLink, fileId: fileName };
};

const uploadFiles = async (request, files) => {
    if (!files || files.length === 0)
        throw new BadRequestError('No files received.');

    const fullDirPath = path.join(process.cwd(), 'public/assets');
    await fs.mkdir(fullDirPath, { recursive: true }); // Ensure the directory exists

    const uploadedFiles = await Promise.all(
        files.map(async (file) => {
            const buffer = await createFileBuffer(file);
            const fileName = generateUniqueFileName(file.name);
            const filePath = `public/assets/${fileName}`;

            // Write the file to the specified directory with the new filename
            await fs.writeFile(path.join(process.cwd(), filePath), buffer);

            // Generate the file link and ID
            const fileLink = generateFileLink(request, `/assets/${fileName}`);
            return { fileLink, fileId: fileName };
        })
    );

    return uploadedFiles;
};

const deleteFile = async (fileId) => {
    try {
        if (fileId) {
            const filePath = path.join(process.cwd(), 'public/assets', fileId);

            // Check if file exists before deleting
            await fs.access(filePath);
            await fs.unlink(filePath);

            logger.info(`File ${fileId} deleted successfully.`);
        }
    } catch (err) {
        // If the error is because the file doesn't exist, ignore it
        if (err.code === 'ENOENT') {
            logger.error(`File ${fileId} does not exist. Skipping deletion.`);
        } else {
            // If it's another type of error, throw it
            throw err;
        }
    }
};

const localFileOperations = {
    uploadFile,
    uploadFiles,
    deleteFile,
};

export default localFileOperations;
