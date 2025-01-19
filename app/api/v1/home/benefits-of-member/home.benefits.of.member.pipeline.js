const homeBenefitsOfMemberPipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $project: {
            _id: 1,
            text: 1,
            createdAt: 1,
            updatedAt: 1,
            ...extraFields, // Include additional fields dynamically
        },
    },
];

export default homeBenefitsOfMemberPipeline;
