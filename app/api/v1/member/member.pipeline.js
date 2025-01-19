const memberPipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $project: {
            _id: 1,
            name: 1,
            email: 1,
            image: { $ifNull: ['$image.link', ''] }, // Sets `image` to `image.link` or empty string if null
            typeId: 1,
            statusId: 1,
            memberId: 1,
            joinDate: 1,
            designation: 1,
            phone: 1, // Added `phone` field
            occupation: 1, // Added `occupation` field
            educationalBackground: 1, // Added `educationalBackground` field
            permanentAddress: 1, // Added complete `permanentAddress` field
            currentAddress: 1, // Added complete `currentAddress` field
            createdAt: 1,
            updatedAt: 1,
            ...extraFields, // Include additional fields dynamically
        },
    },
];

export default memberPipeline;
