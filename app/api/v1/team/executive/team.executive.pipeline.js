const teamExecutivePipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $lookup: {
            from: 'types', // Collection name for types
            localField: 'typeId',
            foreignField: '_id',
            as: 'typeDetails',
        },
    },
    {
        $unwind: {
            path: '$typeDetails',
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $lookup: {
            from: 'statuses', // Collection name for Statuses
            localField: 'statusId',
            foreignField: '_id',
            as: 'statusDetails',
        },
    },
    {
        $unwind: {
            path: '$statusDetails',
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $project: {
            _id: 1,
            name: 1,
            email: 1,
            image: '$image.link', // Map `image.link` directly to `image`
            typeId: 1,
            type: '$typeDetails.type',
            statusId: 1,
            status: '$statusDetails.status',
            joinDate: 1,
            designation: 1,
            organization: 1,
        },
    },
];

export default teamExecutivePipeline;
