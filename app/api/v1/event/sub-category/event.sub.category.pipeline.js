const eventCategoryPipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $lookup: {
            from: 'eventcategories', // Ensure correct collection name
            localField: 'category',
            foreignField: '_id',
            as: 'categoryDetails',
        },
    },
    {
        $unwind: {
            path: '$categoryDetails',
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $project: {
            _id: 1,
            category: '$categoryDetails.category',
            categoryId: '$categoryDetails._id',
            subCategory: '$subCategory',
            createdAt: 1,
            updatedAt: 1,
            ...extraFields, // Include additional fields dynamically
        },
    },
];

export default eventCategoryPipeline;
