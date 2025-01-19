'use server';

import { promises as fs } from 'fs';

const decoder = new TextDecoder('utf-8');

const readFileContent = async (filePath, parseAsJson = false) => {
    try {
        // Read the file contents as a Buffer
        const data = await fs.readFile(filePath);

        // Decode the file contents into a string
        const content = decoder.decode(data);

        // If JSON parsing is requested, parse the content as JSON
        if (parseAsJson) {
            return JSON.parse(content);
        }

        // Return the file content as a string
        return content;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
};

export default readFileContent;
