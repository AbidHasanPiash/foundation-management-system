import { fetchDataAsServer } from './axios';

export default async function getSpecificApiData(api, fields) {
    try {
        // Fetch data from the provided API endpoint
        const responseData = await fetchDataAsServer(api);

        // If `fields` is not an array or is empty, return the full response data
        if (!Array.isArray(fields) || fields.length === 0) {
            return responseData;
        }

        // Extract only the specified fields from the response data
        const extractedData = {};
        fields.forEach((field) => {
            if (responseData.hasOwnProperty(field)) {
                extractedData[field] = responseData[field];
            }
        });

        return extractedData;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return null; // or handle error appropriately
    }
}
