const budgetPipeline = (filter = {}, extraFields = {}) => [
    { $match: filter },
    {
        $lookup: {
            from: 'events', // The name of the Events collection
            localField: 'eventId', // The field in the Budgets collection
            foreignField: '_id', // The field in the Events collection
            as: 'eventDetails', // The name of the resulting array field
        },
    },
    {
        $unwind: {
            path: '$eventDetails', // Unwind the event details array
            preserveNullAndEmptyArrays: true, // Keep budgets without a matching event
        },
    },
    {
        $project: {
            _id: 1,
            eventId: 1,
            budget: 1,
            transactionType: 1,
            hasBankDetails: 1,
            bankDetails: 1,
            eventTitle: '$eventDetails.title', // Map the title from event details to eventTitle
            eventDate: '$eventDetails.eventDate', // You can include more fields like this
            eventDescription: '$eventDetails.description', // Include the event description
            description: 1, // Description of the budget
            totalBudgetAmount: 1,
            totalActualAmount: 1,
            createdAt: 1,
            updatedAt: 1,
            ...extraFields, // Include additional fields dynamically
        },
    },
];

export default budgetPipeline;
