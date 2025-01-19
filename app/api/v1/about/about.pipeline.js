const aboutPipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $project: {
            _id: 1,
            type: 1,
            category: 1,
            title: 1,
            description: 1,
            banner: '$banner.link',
            createdAt: 1,
            updatedAt: 1,
            ...extraFields, // Include additional fields dynamically
        },
    },
];

export default aboutPipeline;
