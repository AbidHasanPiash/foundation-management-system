import mongodb from '@/lib/mongodb';
import BudgetModel from '@/app/api/v1/finance/budget/budget.model';
import httpStatusConstants from '@/constants/httpStatus.constants';
import budgetConstants from '@/app/api/v1/finance/budget/budget.constants';
import budgetSchema from '@/app/api/v1/finance/budget/budget.schema';
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

// Named export for the PATCH request handler
const handleUpdateBudgetCosting = async (request, context) => {
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
        budgetSchema.costingSchema
    );

    // Calculate new total budget from user input
    const actualTotalBudget = userInput?.budget?.reduce(
        (sum, entry) => sum + entry?.actualAmount,
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
                ]
            );

            if (!existingBudget) {
                status = httpStatusConstants.NOT_FOUND;

                throw new Error(
                    `Budget entry with ID "${userInput?.id}" not found.`
                );
            }

            existingEventDetails = await EventModel.findById(
                existingBudget.eventId
            ).session(session);

            if (existingBudget.totalActualAmount > 0) {
                status = httpStatusConstants.BAD_REQUEST;

                throw new Error(
                    `Actual cost for budget entry with ID "${userInput?.id}" has already calculated.`
                );
            }

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
            const currentTotalBudget = existingBudget?.budget?.reduce(
                (sum, entry) => sum + (entry?.budgetAmount || 0),
                0
            );

            // Calculate the difference between the actual budget and the allowed budget
            const treasuryDifference = Math.abs(
                actualTotalBudget - currentTotalBudget
            );

            // Update the treasury balance based on the difference
            if (treasuryDifference !== 0) {
                if (actualTotalBudget > currentTotalBudget) {
                    // Budget is increasing, check if sufficient balance exists
                    const requiredBalance =
                        actualTotalBudget - currentTotalBudget;
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
                    const savings = currentTotalBudget - actualTotalBudget;
                    treasury.balance += savings;
                }

                // Save the updated treasury balance
                await treasury.save({ session });
            }

            // Save the updated treasury balance
            await treasury.save({ session });

            // Update the budget data (only modify the note and actualAmount)
            existingBudget.description =
                userInput.description || existingBudget.description;

            // Iterate over the budget array to update specific entries (based on the budget entry ID or index)
            userInput.budget.forEach((updatedEntry) => {
                const existingEntryIndex = existingBudget.budget.findIndex(
                    (entry) =>
                        entry._id.toString() === updatedEntry._id.toString()
                );

                if (existingEntryIndex === -1) {
                    status = httpStatusConstants.BAD_REQUEST;

                    throw new Error(
                        'Invalid budget details entry ID provided.'
                    );
                }

                // Update only the note and actualAmount
                existingBudget.budget[existingEntryIndex].note =
                    updatedEntry.note ||
                    existingBudget.budget[existingEntryIndex].note;
                existingBudget.budget[existingEntryIndex].actualAmount =
                    updatedEntry.actualAmount ||
                    existingBudget.budget[existingEntryIndex].actualAmount;
            });

            // Manually recalculate totalActualAmount after updating the budget entries
            existingBudget.totalActualAmount = existingBudget?.budget?.reduce(
                (sum, item) => {
                    const validActualAmount = Number(item?.actualAmount) || 0; // Ensure it's a valid number or default to 0
                    return sum + validActualAmount;
                },
                0
            );

            // Save the updated budget
            const updatedBudget = await BudgetModel.findOneAndUpdate(
                { _id: convertToObjectId(userInput.id) }, // Find by ID
                { $set: existingBudget }, // Set the entire updated object
                { new: true, session }
            )
                .populate({ path: 'eventId', select: '-__v' }) // Populate the event
                .lean();

            // Return the updated budget
            return updatedBudget;
        });

        // Send success email only if the transaction was committed successfully
        try {
            await financeEmailTemplate.sendBudgetCreationSuccessEmailToAdmin(
                configuration.contact.admin.email,
                userInput?.eventId,
                updatedBudget.title,
                actualTotalBudget
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
        const emailBody = error.message;

        // Check if the error is related to recalculating the actual budget
        if (error.message.includes('Actual cost for budget entry')) {
            // Notify the admin with a custom email for recalculating the budget
            try {
                await financeEmailTemplate.sendRecalculationAttemptEmailToAdmin(
                    configuration.contact.admin.email,
                    existingEventDetails?._id,
                    existingEventDetails?.title || 'Unknown Event',
                    actualTotalBudget,
                    emailBody
                );
            } catch (emailError) {
                console.error(
                    'Failed to send recalculation attempt email:',
                    emailError
                );
            }
        } else {
            // Default error handling email for other errors
            try {
                await financeEmailTemplate.sendBudgetCreationFailedEmailToAdmin(
                    configuration.contact.admin.email,
                    existingEventDetails?._id,
                    existingEventDetails?.title || 'Unknown Event',
                    actualTotalBudget,
                    emailBody
                );
            } catch (emailError) {
                console.error('Failed to send failure email:', emailError);
            }
        }

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

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateBudgetCosting);
