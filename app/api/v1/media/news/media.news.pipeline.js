const mediaNewsPipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $project: {
            _id: 1,
            title: 1,
            description: 1,
            banner: { $ifNull: ['$banner.link', ''] },
            files: {
                $map: {
                    input: '$files',
                    as: 'file',
                    in: {
                        id: '$$file.id',
                        name: '$$file.name',
                        link: '$$file.link',
                    },
                },
            },
            links: {
                $map: {
                    input: '$links',
                    as: 'link',
                    in: {
                        id: '$$link.id',
                        name: '$$link.name',
                        link: '$$link.link',
                    },
                },
            },
            createdAt: 1,
            updatedAt: 1,
            ...extraFields, // Include additional fields dynamically
        },
    },
];

export default mediaNewsPipeline;
