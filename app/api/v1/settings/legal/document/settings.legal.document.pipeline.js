const settingsLegalDocumentPipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $project: {
            _id: 1,
            title: 1,
            effectiveDate: 1,
            description: 1,
            documents: 1,
            createdAt: 1,
            updatedAt: 1,
            ...extraFields, // Include additional fields dynamically
        },
    },
];

export default settingsLegalDocumentPipeline;
