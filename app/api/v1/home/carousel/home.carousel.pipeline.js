const homeCarouselPipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $project: {
            _id: 1,
            title: 1,
            image: '$image.link', // Map `image.link` directly to `image`
            createdAt: 1,
            updatedAt: 1,
            ...extraFields, // Include additional fields dynamically
        },
    },
];

export default homeCarouselPipeline;
