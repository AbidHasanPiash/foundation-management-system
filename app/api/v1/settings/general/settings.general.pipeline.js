const settingsGeneralPipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $project: {
            _id: 1,
            name: 1,
            description: 1,
            startDate: 1,
            logo: { $ifNull: ['$logo.link', ''] },
            address: 1,
            emails: 1,
            contacts: 1,
            socialLinks: 1,
            createdAt: 1,
            updatedAt: 1,
            ...extraFields, // Include additional fields dynamically
        },
    },
];

export default settingsGeneralPipeline;
