import mongodb from '@/lib/mongodb';
import BudgetModel from '@/app/api/v1/finance/budget/budget.model';
import httpStatusConstants from '@/constants/httpStatus.constants';
import budgetConstants from '@/app/api/v1/finance/budget/budget.constants';
import budgetSchema from '@/app/api/v1/finance/budget/budget.schema';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';
import TreasuryModel from '@/app/api/v1/finance/(treasury)/treasury.model';
import EventModel from '@/app/api/v1/event/event.model';
import financeEmailTemplate from '@/app/api/v1/finance/finance.email.template';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import validateToken from '@/util/validateToken';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import sendResponse from '@/util/sendResponse';
import configurations from '@/configs/configurations';
import convertToObjectId from '@/util/convertToObjectId';

const configuration = await configurations();
const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetBudgetById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    // Define the aggregation pipeline using the validated id
    const pipeline = [
        { $match: { _id: convertToObjectId(userInput?.id) } },
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
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ];

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        BudgetModel,
        pipeline,
        'Budget',
        request,
        userInput
    );
};

// Named export for the PATCH request handler
const handleUpdateBudget = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        budgetConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Connect to MongoDB
    await mongodb.connect();

    // Validate admin authentication
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Start a MongoDB session
    const session = await mongodb.startSession();

    let existingEventDetails = null; // Will be set during validation
    let status = null;

    // Parse and validate form data (using the update schema)
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'update',
        budgetSchema.updateSchema
    );

    // Calculate new total budget from user input
    const newTotalBudget = userInput.budget.reduce(
        (sum, entry) => sum + entry.budgetAmount,
        0
    );

    try {
        // Use withTransaction to handle commit and abort automatically
        const updatedBudget = await session.withTransaction(async () => {
            // Fetch the existing budget, treasury, and event in parallel
            const [existingBudget, treasury, existingEvent] = await Promise.all(
                [
                    BudgetModel.findById(userInput.id).session(session).lean(),
                    TreasuryModel.findOne().session(session),
                    userInput.eventId
                        ? EventModel.findById(userInput.eventId).session(
                              session
                          )
                        : null,
                ]
            );

            if (!existingBudget) {
                status = httpStatusConstants.NOT_FOUND;

                throw new Error(
                    `Budget entry with ID "${userInput?.id}" not found.`
                );
            }

            existingEventDetails = existingEvent;

            if (!treasury) {
                status = httpStatusConstants.NOT_FOUND;

                throw new Error('Treasury not found.');
            }

            if (userInput.eventId && !existingEvent) {
                status = httpStatusConstants.NOT_FOUND;

                throw new Error(
                    `Event entry with ID "${userInput?.eventId}" not found.`
                );
            }

            // Calculate current total budget from existing budget array
            const currentTotalBudget = existingBudget.budget.reduce(
                (sum, entry) => sum + (entry.budgetAmount || 0),
                0
            );

            // Calculate the treasury difference
            const treasuryDifference = Math.abs(
                newTotalBudget - currentTotalBudget
            );

            // Update the treasury balance based on the difference
            if (treasuryDifference !== 0) {
                if (newTotalBudget > currentTotalBudget) {
                    // Budget is increasing, check if sufficient balance exists
                    const requiredBalance = newTotalBudget - currentTotalBudget;
                    if (treasury.balance < requiredBalance) {
                        status = httpStatusConstants.UNPROCESSABLE_ENTITY;

                        throw new Error(
                            'Insufficient balance in the treasury to allocate this amount.'
                        );
                    }
                    // Deduct the required balance from treasury
                    treasury.balance -= requiredBalance;
                } else {
                    // Budget is decreasing, add the savings to the treasury
                    const savings = currentTotalBudget - newTotalBudget;
                    treasury.balance += savings;
                }

                // Save the updated treasury balance
                await treasury.save({ session });
            }

            // Replace the entire budget array with the new budget
            const updatedBudget = await BudgetModel.findOneAndUpdate(
                { _id: userInput.id }, // Find by ID
                {
                    $set: {
                        description:
                            userInput.description || existingBudget.description,
                        budget: userInput.budget || existingBudget.budget, // Replace the entire budget array
                        eventId: userInput.eventId || existingBudget.eventId, // Update eventId if provided
                    },
                },
                { new: true, session } // Return the updated budget document
            )
                .populate({ path: 'eventId', select: '-__v' }) // Populate the event
                .lean();

            // Return the updated budget document
            return updatedBudget;
        });

        // Send success email only if the transaction was committed successfully
        try {
            await financeEmailTemplate.sendBudgetCreationSuccessEmailToAdmin(
                configuration.contact.admin.email,
                userInput?.eventId,
                updatedBudget.title,
                newTotalBudget
            );
        } catch (emailError) {
            console.error('Failed to send success email:', emailError);
        }

        // Return the success response with updated budget
        return sendResponse(
            true,
            httpStatusConstants.OK,
            `Budget for event ID "${updatedBudget?.eventId?._id}" updated successfully.`,
            updatedBudget,
            {},
            request
        );
    } catch (error) {
        // Send failure email in case of failure
        await financeEmailTemplate.sendBudgetCreationFailedEmailToAdmin(
            configuration.contact.admin.email,
            userInput?.eventId,
            existingEventDetails?.title || 'Unknown Event',
            newTotalBudget,
            error.message
        );

        // Return error response
        return sendResponse(
            false,
            status ? status : httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update budget: ${error.message}`,
            {},
            {},
            request
        );
    } finally {
        // End the session regardless of success or failure
        await session.endSession();
    }
};

// Named export for the DELETE request handler
const handleDeleteEventCategory = async (request, context) => {
    return serviceShared.deleteEntry(
        request,
        context,
        idValidationSchema,
        BudgetModel,
        '', // Projection field for file deletion
        `Budget`
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetBudgetById);

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateBudget);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteEventCategory);
