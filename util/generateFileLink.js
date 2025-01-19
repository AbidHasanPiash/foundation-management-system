const generateFileLink = (request, filePath) => {
    // Extract host and protocol information from the request headers
    const host = request.headers.get('host');
    const protocol = host.startsWith('localhost') ? 'http' : 'https';

    // Dynamically create the server base URL
    const SERVER_BASE_URL = `${protocol}://${host}`;

    return `${SERVER_BASE_URL}/${filePath}`;
};

export default generateFileLink;
