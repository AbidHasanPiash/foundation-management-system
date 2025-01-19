import mongodb from '@/lib/mongodb';
import TreasuryModel from '@/app/api/v1/finance/(treasury)/treasury.model';
import httpStatusConstants from '@/constants/httpStatus.constants';
import DonationModel from '@/app/api/v1/finance/donation/donation.model';
import BudgetModel from '@/app/api/v1/finance/budget/budget.model';

import asyncHandler from '@/util/asyncHandler';
import sendResponse from '@/util/sendResponse';

// Named export for the GET request handler
const handleGetTreasuryInfo = async (request, context) => {
    // Connect to MongoDB
    await mongodb.connect();

    // Fetch the latest treasury balance
    const currentTreasury = await TreasuryModel.findOne()
        .sort({ createdAt: -1 })
        .limit(1);
    if (!currentTreasury) {
        return sendResponse(
            true,
            httpStatusConstants.NOT_FOUND,
            'Treasury not found.',
            {},
            {},
            request
        );
    }

    // Calculate the first and last day of the last month
    const now = new Date();
    const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
    );
    const lastDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59
    );

    // Aggregate total donations from the last month
    const totalDonationsLastMonth = await DonationModel.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: firstDayOfLastMonth,
                    $lte: lastDayOfLastMonth,
                },
            },
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: '$amount' },
            },
        },
    ]);

    const donationsLastMonth = totalDonationsLastMonth[0]?.totalAmount || 0;

    // Aggregate total actual amounts from last month's budget
    const totalBudgetActualAmountLastMonth = await BudgetModel.aggregate([
        {
            $match: {
                'budget.date': {
                    $gte: firstDayOfLastMonth,
                    $lte: lastDayOfLastMonth,
                },
            },
        },
        {
            $unwind: '$budget',
        },
        {
            $match: {
                'budget.date': {
                    $gte: firstDayOfLastMonth,
                    $lte: lastDayOfLastMonth,
                },
            },
        },
        {
            $group: {
                _id: null,
                totalActualAmount: { $sum: '$budget.actualAmount' },
            },
        },
    ]);

    const actualBudgetLastMonth =
        totalBudgetActualAmountLastMonth[0]?.totalActualAmount || 0;

    // Calculate the last month's balance: donations - actual budget
    const lastMonthBalance = donationsLastMonth - actualBudgetLastMonth;

    // Find the most recent donation to display as last donation
    const lastDonation = await DonationModel.findOne()
        .sort({ createdAt: -1 })
        .limit(1);

    // Prepare the response data
    const treasuryInfo = {
        currentBalance: currentTreasury.balance,
        lastMonthBalance,
        lastDonation: lastDonation || null,
    };

    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Treasury info fetched successfully.',
        treasuryInfo,
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetTreasuryInfo);
