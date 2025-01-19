const prepareFormDataForLogging = async (data, queryAndParams = {}) => {
    const loggedData = {
        body: {},
        query: queryAndParams.query || {},
        params: queryAndParams.params || {},
    };

    // Check if data is null or undefined to avoid processing errors
    if (!data) {
        return loggedData;
    }

    // Handle FormData separately
    if (data instanceof FormData) {
        for (const [key, value] of data.entries()) {
            if (value instanceof File) {
                const fileData = await value.arrayBuffer();
                const base64String = Buffer.from(fileData).toString('base64');
                loggedData.body[key] =
                    `data:${value.type};base64,${base64String}`;
            } else {
                loggedData.body[key] = value;
            }
        }
    } else {
        // Handle plain object, and check if it contains File instances
        for (const [key, value] of Object.entries(data)) {
            if (value instanceof File) {
                const fileData = await value.arrayBuffer();
                const base64String = Buffer.from(fileData).toString('base64');
                loggedData.body[key] =
                    `data:${value.type};base64,${base64String}`;
            } else {
                loggedData.body[key] = value;
            }
        }
    }

    return loggedData;
};

export default prepareFormDataForLogging;
