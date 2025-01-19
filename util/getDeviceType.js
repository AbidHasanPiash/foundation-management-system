// Helper function to detect device type from User-Agent
const getDeviceType = (userAgent) => {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
};

export default getDeviceType;
