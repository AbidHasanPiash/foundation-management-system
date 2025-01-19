import mongodb from '@/lib/mongodb';
import BudgetModel from '@/app/api/v1/finance/budget/budget.model';
import httpStatusConstants from '@/constants/httpStatus.constants';
import budgetConstants from '@/app/api/v1/finance/budget/budget.constants';
import budgetSchema from '@/app/api/v1/finance/budget/budget.schema';
import EventModel from '@/app/api/v1/event/event.model';
import TreasuryModel from '@/app/api/v1/finance/(treasury)/treasury.model';
import financeEmailTemplate from '@/app/api/v1/finance/finance.email.template';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import validateToken from '@/util/validateToken';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import sendResponse from '@/util/sendResponse';
import configurations from '@/configs/configurations';
import budgetPipeline from '@/app/api/v1/finance/budget/budget.pipeline';

const configuration = await configurations();

// Named export for the POST request handler
const handleCreateBudget = async (request, context) => {
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

    let existingEvent = null; // Will be set during validation
    let status = null;

    // Validate admin authentication
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        budgetSchema.createSchema
    );

    // Calculate the total requested budget
    const totalRequestedBudget = userInput.budget.reduce(
        (sum, item) => sum + item.budgetAmount,
        0
    );

    // Check if the event exists
    existingEvent = await EventModel.findOne({ _id: userInput?.eventId });
    if (!existingEvent) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Event entry with ID "${userInput?.eventId}" not found.`,
            {},
            {},
            request
        );
    }

    // Start a MongoDB session
    const session = await mongodb.startSession();

    try {
        // Use withTransaction to handle commit and abort automatically
        const createdBudget = await session.withTransaction(async () => {
            // Check if the event already has an assigned budget
            const existingBudget = await BudgetModel.findOne({
                eventId: userInput?.eventId,
            }).session(session);
            if (existingBudget) {
                status = httpStatusConstants.CONFLICT;

                throw new Error(
                    `The event with ID "${userInput?.eventId}" already has a budget allowance. Please update the existing budget instead of allocating a new budget.`
                );
            }

            // Check if the treasury has enough balance for the requested budget
            const treasury = await TreasuryModel.findOne().session(session);
            if (!treasury || treasury.balance < totalRequestedBudget) {
                status = httpStatusConstants.UNPROCESSABLE_ENTITY;

                throw new Error(
                    'Insufficient balance in the treasury to allocate this budget.'
                );
            }

            // Deduct the amount from the treasury
            treasury.balance -= totalRequestedBudget;
            await treasury.save({ session });

            // Create a new budget document
            const createdBudget = await BudgetModel.create(
                [
                    {
                        eventId: userInput.eventId,
                        budget: userInput.budget.map((entry) => ({
                            purpose: entry.purpose,
                            note: entry.note || '',
                            paymentDetails: entry.paymentDetails,
                            budgetAmount: entry.budgetAmount,
                            actualAmount: entry.actualAmount || 0, // Default actualAmount to 0 if missing
                            date: new Date(), // Set the current date for the budget entry
                        })),
                        description: userInput.description || '',
                    },
                ],
                { session }
            );

            // Return the created budget document
            return createdBudget[0];
        });

        // Fetch the created budget details with populated event information
        const populatedBudget = await BudgetModel.findById(createdBudget._id)
            .populate({
                path: 'eventId',
                select: '-__v', // Exclude __v field in the response
            })
            .lean();

        // Send success email only if the transaction was committed successfully
        try {
            await financeEmailTemplate.sendBudgetCreationSuccessEmailToAdmin(
                configuration.contact.admin.email,
                userInput?.eventId,
                existingEvent.title,
                totalRequestedBudget
            );
        } catch (emailError) {
            console.error('Failed to send success email:', emailError);
        }

        // Return a success response with the created budget details
        return sendResponse(
            true,
            httpStatusConstants.CREATED,
            `Budget for event ID "${createdBudget?.eventId?._id}" created successfully.`,
            populatedBudget,
            {},
            request
        );
    } catch (error) {
        // Send failure email in case of failure
        await financeEmailTemplate.sendBudgetCreationFailedEmailToAdmin(
            configuration.contact.admin.email,
            userInput?.eventId,
            existingEvent?.title || 'Unknown Event',
            totalRequestedBudget,
            error.message
        );

        // Return an error response with detailed message
        return sendResponse(
            false,
            status ? status : httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to create budget: ${error.message}`,
            {},
            {},
            request
        );
    } finally {
        await session.endSession(); // End the session
    }
};

// Named export for the GET request handler
const handleGetBudgetList = async (request, context) => {
    const filter = {}; // Add filters if needed
    const projection = {};
    const pipeline = budgetPipeline(filter, projection);

    return serviceShared.fetchEntryList(
        BudgetModel,
        pipeline,
        'budget',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateBudget);

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetBudgetList);
