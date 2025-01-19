import { CryptoError } from '@/util/asyncHandler';

import httpStatusConstants from '@/constants/httpStatus.constants';
import AdminModel from '@/app/api/v1/admin/admin.model';
import SuperAdminModel from '@/app/api/v1/auth/super-admin/super.admin.model';
import MemberModel from '@/app/api/v1/member/member.model';
import DonationModel from '@/app/api/v1/finance/donation/donation.model';

import sendResponse from '@/util/sendResponse';
import getAuthToken from './getAuthToken';
import { decryptData } from '@/util/crypto';
import verifyToken from '@/util/verifyToken';
import convertToObjectId from '@/util/convertToObjectId';
import getDeviceType from '@/util/getDeviceType';

const validateToken = async (request, type) => {
    const encryptedToken = getAuthToken(request);
    let token;

    try {
        token = decryptData(encryptedToken);
    } catch (error) {
        throw new CryptoError('Invalid token provided.');
    }

    const tokenDetails = await verifyToken(token, type);

    if (!tokenDetails?.currentUser?._id) {
        return {
            isAuthorized: false,
            response: sendResponse(
                false,
                httpStatusConstants.FORBIDDEN,
                'Authorization failed. User is not authorized to perform this action.',
                {},
                {},
                request
            ),
        };
    }

    let existingUser = {};
    const userId = convertToObjectId(tokenDetails?.currentUser?._id);

    if (tokenDetails?.currentUser?.userType === 'admin') {
        existingUser = await AdminModel.findById(userId)
            .select({ password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
            .lean();

        existingUser.userType = tokenDetails?.currentUser?.userType;
    } else if (tokenDetails?.currentUser?.userType === 'super-admin') {
        existingUser = await SuperAdminModel.findById(userId)
            .select({ password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
            .lean();

        existingUser.userType = tokenDetails?.currentUser?.userType;
    } else {
        existingUser = await MemberModel.findById(userId)
            .select({ password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
            .lean();

        const pipeline = [
            {
                $match: { memberId: userId }, // Find donations by member ID
            },
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
                    from: 'events', // The name of the Events collection
                    localField: 'eventId', // The field in the Donations collection that should match `eventId` in Events
                    foreignField: '_id', // The field in the Events collection
                    as: 'eventDetails', // The name of the resulting array field
                },
            },
            {
                $unwind: {
                    path: '$eventDetails', // Unwind the event details array
                    preserveNullAndEmptyArrays: true, // Keep donations without a matching event
                },
            },
            {
                $project: {
                    _id: 1,
                    donationType: 1,
                    memberId: 1,
                    eventId: 1,
                    eventName: {
                        $ifNull: ['$eventDetails.name', 'No event associated'], // Display 'No event associated' if no event is linked
                    },
                    amount: 1,
                    hasBankDetails: 1,
                    bankDetails: 1,
                    'paymentMethodDetails.name': {
                        $ifNull: ['$paymentMethodDetails.name', 'Unknown'],
                    },
                    'paymentMethodDetails.type': {
                        $ifNull: ['$paymentMethodDetails.type', 'Unknown'],
                    },
                    description: 1,
                    collectedBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ];

        const donationDetails = await DonationModel.aggregate(pipeline);

        existingUser.userType = tokenDetails?.currentUser?.userType;
        existingUser.donations = donationDetails;
    }

    if (!existingUser) {
        return {
            isAuthorized: false,
            response: sendResponse(
                false,
                httpStatusConstants.FORBIDDEN,
                'Authorization failed. User is not authorized to perform this action.',
                {},
                {},
                request
            ),
        };
    }

    // Get device type
    const userAgent = request.headers.get('User-Agent') || '';

    existingUser.deviceType = getDeviceType(userAgent);

    return { isAuthorized: true, user: existingUser };
};

export default validateToken;
