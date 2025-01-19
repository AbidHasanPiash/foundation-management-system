const getQueryParams = (search) => {
    const urlParams = new URLSearchParams(search); // Parse the search query string
    const params = {};

    // Iterate over the searchParams to extract key-value pairs
    urlParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
};

export default getQueryParams;
