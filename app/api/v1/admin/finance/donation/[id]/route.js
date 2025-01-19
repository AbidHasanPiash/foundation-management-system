import mongodb from '@/lib/mongodb';
import BudgetModel from '@/app/api/v1/finance/budget/budget.model';
import httpStatusConstants from '@/constants/httpStatus.constants';
import budgetConstants from '@/app/api/v1/finance/budget/budget.constants';
import serviceShared from '@/shared/service.shared';
import schemaShared from '@/shared/schema.shared';
import MemberModel from '@/app/api/v1/member/member.model';
import EventModel from '@/app/api/v1/event/event.model';
import DonationModel from '@/app/api/v1/finance/donation/donation.model';
import financeEmailTemplate from '@/app/api/v1/finance/finance.email.template';
import TreasuryModel from '@/app/api/v1/finance/(treasury)/treasury.model';
import donationSchema from '@/app/api/v1/finance/donation/donation.schema';

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
const handleGetDonationById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const pipeline = [
        { $match: { _id: convertToObjectId(userInput?.id) } }, // Find document by type
        {
            $lookup: {
                from: 'paymentmethods', // The name of the PaymentMethods collection
                localField: 'paymentMethodId', // The field in the Donations collection
                foreignField: '_id', // The field in the PaymentMethods collection
                as: 'paymentMethodDetails', // The name of the resulting array field
            },
        },
        {
            $unwind: {
                path: '$paymentMethodDetails', // Unwind the payment method details array
                preserveNullAndEmptyArrays: true, // Keep donations without a matching payment method
            },
        },
        {
            $lookup: {
                from: 'members', // The name of the Members collection
                localField: 'memberNo', // The field in the Donations collection
                foreignField: 'memberNo', // The field in the Members collection
                as: 'memberDetails', // The name of the resulting array field
            },
        },
        {
            $unwind: {
                path: '$memberDetails', // Unwind the member details array
                preserveNullAndEmptyArrays: true, // Keep donations without a matching member
            },
        },
        {
            $project: {
                _id: 1,
                donationType: 1,
                memberId: 1,
                eventId: 1,
                memberNo: 1,
                amount: 1,
                hasBankDetails: 1,
                bankDetails: 1,
                'paymentMethodDetails.name': {
                    $ifNull: ['$paymentMethodDetails.name', 'Unknown'],
                },
                'paymentMethodDetails.type': {
                    $ifNull: ['$paymentMethodDetails.type', 'Unknown'],
                },
                'memberDetails.name': {
                    $ifNull: ['$memberDetails.name', 'Unknown'],
                },
                'memberDetails.email': {
                    $ifNull: ['$memberDetails.email', 'Unknown'],
                },
                description: 1,
                collectedBy: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ];

    return serviceShared.fetchEntryById(
        DonationModel,
        pipeline,
        'donation',
        request,
        userInput
    );
};

// Named export for the PATCH request handler
const handleUpdateDonation = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        budgetConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'update',
        donationSchema.updateSchema
    );

    // Connect to MongoDB
    await mongodb.connect();

    // Start MongoDB session for transaction
    const session = await mongodb.startSession();
    session.startTransaction();

    // Validate admin authentication
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Validate member exists
    if (userInput.memberId) {
        const existingMember = await MemberModel.findOne({
            _id: userInput.memberId,
        }).lean();
        if (!existingMember) {
            return sendResponse(
                false,
                httpStatusConstants.NOT_FOUND,
                `Member with ID "${userInput.memberId}" not found.`,
                {},
                {},
                request
            );
        }
    }

    // Validate event exists (if provided)
    if (userInput.eventId) {
        const existingEvent = await EventModel.exists({
            _id: userInput.eventId,
        }).lean();
        if (!existingEvent) {
            return sendResponse(
                false,
                httpStatusConstants.NOT_FOUND,
                `Event with ID "${userInput.eventId}" not found.`,
                {},
                {},
                request
            );
        }
    }

    // Validate collector exists
    const existingCollector = await MemberModel.exists({
        _id: userInput.collectedBy,
    }).lean();
    if (!existingCollector) {
        return sendResponse(
            false,
            httpStatusConstants.NOT_FOUND,
            `Collector with ID "${userInput.collectedBy}" not found.`,
            {},
            {},
            request
        );
    }

    try {
        // Fetch the existing donation to be updated
        const existingDonation = await DonationModel.findById(
            userInput.id
        ).lean();
        if (!existingDonation) {
            return sendResponse(
                false,
                httpStatusConstants.NOT_FOUND,
                `Donation with ID "${userInput.id}" not found.`,
                {},
                {},
                request
            );
        }

        // Prepare fields for update
        const updateFields = {
            collectedBy: userInput.collectedBy || existingDonation.collectedBy,
            eventId: userInput.eventId || existingDonation.eventId,
            memberId: userInput.memberId || existingDonation.memberId,
            amount: userInput.amount || existingDonation.amount, // Only update amount if provided
        };

        // Update the donation document
        const updatedDonation = await DonationModel.findByIdAndUpdate(
            userInput.id,
            { $set: updateFields },
            { new: true, session } // Ensure we use the same session for transaction
        ).lean();

        // Update treasury balance if amount was changed
        if (
            userInput.amount !== undefined &&
            userInput.amount !== existingDonation.amount
        ) {
            let treasury = await TreasuryModel.findOne().session(session);
            if (!treasury) {
                // If no treasury exists, create a new one
                treasury = new TreasuryModel({ balance: userInput.amount });
                await treasury.save({ session });
            } else {
                // Update existing treasury balance by subtracting old amount and adding the new one
                treasury.balance += userInput.amount - existingDonation.amount;
                await treasury.save({ session });
            }
        }

        // Commit the transaction
        await session.commitTransaction();

        // Send notification emails (optional)
        await financeEmailTemplate.sendDonationNotificationToAdmin(
            configuration.contact.admin.email,
            existingCollector?.name,
            userInput.amount,
            new Date().toLocaleDateString()
        );
        await financeEmailTemplate.sendDonationReceiptToUser(
            existingCollector?.email,
            existingCollector?.name,
            userInput.amount,
            new Date().toLocaleDateString()
        );

        // Return a success response with the updated donation details
        return sendResponse(
            true,
            httpStatusConstants.OK,
            `Donation with ID "${userInput.id}" updated successfully and treasury updated.`,
            updatedDonation,
            {},
            request
        );
    } catch (error) {
        // Abort the transaction in case of an error
        await session.abortTransaction();

        // Send failure notification emails
        await financeEmailTemplate.sendFailedDonationNotificationToAdmin(
            configuration.contact.admin.email,
            existingCollector?.name,
            userInput.amount,
            error.message
        );
        await financeEmailTemplate.sendFailedDonationNotificationToUser(
            existingCollector?.email,
            existingCollector?.name,
            userInput.amount,
            error.message
        );

        // Return an error response
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to update donation: ${error.message}`,
            {},
            {},
            request
        );
    } finally {
        await session.endSession(); // End the session
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
export const GET = asyncHandler(handleGetDonationById);

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateDonation);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteEventCategory);
