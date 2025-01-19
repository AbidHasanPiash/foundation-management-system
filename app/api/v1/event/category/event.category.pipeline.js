const eventCategoryPipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $lookup: {
            from: 'eventsubcategories', // The collection name for EventSubCategoryModel
            localField: '_id', // The _id field in EventCategoryModel
            foreignField: 'category', // The category field in EventSubCategoryModel
            as: 'subcategoryList', // The output array field
        },
    },
    {
        $project: {
            _id: 1,
            category: 1,
            isSpecial: 1,
            subcategoryList: {
                $map: {
                    input: '$subcategoryList',
                    as: 'sub',
                    in: {
                        _id: '$$sub._id',
                        subCategory: '$$sub.subCategory',
                    },
                },
            },
            createdAt: 1,
            updatedAt: 1,
            ...extraFields, // Include additional fields dynamically
        },
    },
];

export default eventCategoryPipeline;
