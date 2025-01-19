const noticePipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $project: {
            _id: 1,
            publishDate: 1,
            title: 1,
            fileName: 1,
            fileLink: '$file.link', // Directly map the file link
            linkName: 1,
            link: 1,
            createdAt: 1,
            updatedAt: 1,
            ...extraFields, // Include additional fields dynamically
        },
    },
];

export default noticePipeline;
