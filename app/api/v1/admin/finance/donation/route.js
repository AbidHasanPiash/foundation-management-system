import mongodb from '@/lib/mongodb';
import httpStatusConstants from '@/constants/httpStatus.constants';
import budgetConstants from '@/app/api/v1/finance/budget/budget.constants';
import donationSchema from '@/app/api/v1/finance/donation/donation.schema';
import MemberModel from '@/app/api/v1/member/member.model';
import EventModel from '@/app/api/v1/event/event.model';
import DonationModel from '@/app/api/v1/finance/donation/donation.model';
import TreasuryModel from '@/app/api/v1/finance/(treasury)/treasury.model';
import financeEmailTemplate from '@/app/api/v1/finance/finance.email.template';
import TypeModel from '@/app/api/v1/type/type.model';
import typeConstants from '@/app/api/v1/type/type.constants';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import validateToken from '@/util/validateToken';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import sendResponse from '@/util/sendResponse';
import configurations from '@/configs/configurations';

const configuration = await configurations();

// Named export for the POST request handler
const handleAddDonation = async (request, context) => {
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
        'create',
        donationSchema.createSchema
    );

    // Connect to MongoDB
    await mongodb.connect();

    // Connect to MongoDB
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

    // Validate event exists
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
        // Validate payment method exists
        if (
            !(await TypeModel.exists({
                category: typeConstants.categories.paymentMethod,
                _id: userInput.paymentMethodId,
            }))
        ) {
            return sendResponse(
                false,
                httpStatusConstants.NOT_FOUND,
                `Payment method with ID "${userInput.paymentMethodId}" not found.`,
                {},
                {},
                request
            );
        }

        // Create the donation document
        const [createdDonation] = await DonationModel.create([userInput], {
            session,
        });

        // Update or create treasury balance
        let treasury = await TreasuryModel.findOne().session(session);
        if (!treasury) {
            // If no treasury exists, create a new one
            treasury = new TreasuryModel({ balance: userInput.amount });
            await treasury.save({ session });
        } else {
            // Update existing treasury balance
            treasury.balance += userInput.amount;
            await treasury.save({ session });
        }

        // Commit the transaction
        await session.commitTransaction();
        await session.endSession();

        // Send login notification email
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

        // Return a success response
        return sendResponse(
            true,
            httpStatusConstants.CREATED,
            `Donation from member ID "${userInput.memberId}" added successfully and treasury updated.`,
            createdDonation,
            {},
            request
        );
    } catch (error) {
        // Abort the transaction in case of an error
        if (session.inTransaction()) {
            await session.abortTransaction();
            await session.endSession();
        }

        // // Send login notification email
        // await financeEmailTemplate.sendFailedDonationNotificationToAdmin(
        //     configuration.contact.admin.email,
        //     existingCollector?.name,
        //     userInput.amount,
        //     error.message
        // );
        // await financeEmailTemplate.sendFailedDonationNotificationToUser(
        //     existingCollector?.email,
        //     existingCollector?.name,
        //     userInput.amount,
        //     error.message
        // );

        // Return an error response
        return sendResponse(
            false,
            httpStatusConstants.INTERNAL_SERVER_ERROR,
            `Failed to add donation: ${error.message}`,
            {},
            {},
            request
        );
    }
};

// Named export for the GET request handler
const handleGetDonationList = async (request, context) => {
    const pipeline = [
        {
            $lookup: {
                from: 'types', // The name of the PaymentMethods collection
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
                localField: 'memberId', // The field in the Donations collection that should match `memberId` in MemberModel
                foreignField: '_id', // The field in the Members collection
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

    return serviceShared.fetchEntryList(
        DonationModel,
        pipeline,
        'donation',
        request,
        context
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleAddDonation);

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetDonationList);
