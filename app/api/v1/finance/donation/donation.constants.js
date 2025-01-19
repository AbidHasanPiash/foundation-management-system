import contentTypesConstants from '@/constants/contentTypes.constants';

const allowedContentTypes = [contentTypesConstants.JSON];
const transactionType = {
    return: 'return',
    disbursement: 'disbursement',
};
const donationType = {
    monthlyFee: 'monthly_fee',
    eventFee: 'event_fee',
    others: 'others',
};

const allowedTransactionTypes = Object.keys(transactionType);
const allowedDonationTypes = Object.values(donationType);

const donationConstants = {
    allowedContentTypes,
    transactionType,
    donationType,
    allowedTransactionTypes,
    allowedDonationTypes,
};

export default donationConstants;
