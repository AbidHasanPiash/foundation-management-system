const formSpecialScholarshipPipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $lookup: {
            from: 'formspecialeligibleinstitutes', // Collection name for eligible schools
            localField: 'eligibleSchools', // Field in the current collection
            foreignField: '_id', // Field in the eligible schools collection
            as: 'eligibleSchools', // Name of the field for populated data
        },
    },
    {
        $unwind: {
            path: '$eligibleSchools', // Unwind the eligibleSchools array
            preserveNullAndEmptyArrays: true, // Keep documents even if eligibleSchools is empty
        },
    },
    {
        $group: {
            _id: '$_id',
            formCode: { $first: '$formCode' },
            slNo: { $first: '$slNo' },
            formTitle: { $first: '$formTitle' },
            formName: { $first: '$formName' },
            venue: { $first: '$venue' },
            lastDate: { $first: '$lastDate' },
            eligibleSchools: { $push: '$eligibleSchools' },
            exam: { $first: '$exam' },
            note: { $first: '$note' },
            isActive: { $first: '$isActive' },
            data: { $first: '$data' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
        },
    },
    {
        $sort: {
            lastDate: 1, // Sort by lastDate in ascending order (earliest dates first)
        },
    },
    {
        $project: {
            _id: 1,
            formCode: 1,
            slNo: 1,
            formTitle: 1,
            formName: 1,
            venue: 1,
            lastDate: 1,
            eligibleSchools: 1, // Populated eligible schools field
            exam: 1,
            note: 1,
            isActive: 1,
            data: 1,
            createdAt: 1,
            updatedAt: 1,
        },
    },
];

export default formSpecialScholarshipPipeline;
