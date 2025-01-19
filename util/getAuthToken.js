const getAuthToken = (request) => {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader?.slice(7); // Remove "Bearer " (7 characters)
    }
    return null; // Return null if no valid token is found
};

export default getAuthToken;
