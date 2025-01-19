const getContentType = (request) => request.headers.get('content-type') || '';

export default getContentType;
