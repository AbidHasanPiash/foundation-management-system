const eventPipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $lookup: {
            from: 'eventcategories', // Collection name for EventCategories
            localField: 'categoryId',
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
        $lookup: {
            from: 'eventsubcategories', // Collection name for EventSubCategories
            localField: 'subcategoryId',
            foreignField: '_id',
            as: 'subCategoryDetails',
        },
    },
    {
        $unwind: {
            path: '$subCategoryDetails',
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
        $project: {
            _id: 1,
            categoryId: 1,
            category: '$categoryDetails.category',
            subcategoryId: 1,
            subCategory: '$subCategoryDetails.subCategory',
            statusId: 1,
            status: '$statusDetails.status',
            specialFormId: 1,
            typeId: 1,
            type: '$typeDetails.type',
            title: 1,
            eventDate: 1,
            description: 1,
            banner: { $ifNull: ['$banner.link', ''] },
            files: {
                $map: {
                    input: '$files',
                    as: 'file',
                    in: {
                        id: { $ifNull: ['$$file.id', ''] },
                        name: { $ifNull: ['$$file.name', ''] },
                        link: { $ifNull: ['$$file.link', ''] },
                    },
                },
            },
            links: 1,
            finance: {
                budgets: {
                    $ifNull: ['$budgetDetails.allowances', []],
                },
                returns: {
                    $ifNull: ['$budgetDetails.returns', []],
                },
                totalBudget: {
                    $sum: '$budgetDetails.allowances.amount',
                },
                totalReturn: {
                    $sum: '$budgetDetails.returns.amount',
                },
                hasBankDetails: '$budgetDetails.hasBankDetails',
                bankDetails: '$budgetDetails.bankDetails',
            },
        },
    },
];

export default eventPipeline;
