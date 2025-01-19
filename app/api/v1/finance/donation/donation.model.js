import { Schema, models, model } from 'mongoose';

import donationConstants from '@/app/api/v1/finance/donation/donation.constants';
import modelShared from '@/shared/model.shared';

const { stringEnumField, stringField, numberField, booleanField, refField } =
    modelShared;

const donationSchema = new Schema(
    {
        donationType: stringEnumField(
            'Donation type',
            true,
            false,
            Object.values(donationConstants.donationType)
        ),
        memberId: refField('Members', 'Member ID', true),
        eventId: refField('Events', 'Event ID', false),
        amount: numberField('Donation Amount', true, 0, 0),
        paymentMethodId: refField('Types', 'Payment Method', true),
        hasBankDetails: booleanField('Has Bank Details', false),
        bankDetails: {
            bankName: stringField('Bank Name', false),
            branchName: stringField('Branch Name', false),
        },
        description: stringField('Description', false),
        collectedBy: refField('Members', "Collected by Member's ID", true),
    },
    { timestamps: true }
);

// Add unique constraint validation message
donationSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Duplicate entry detected for a unique field.'));
    } else {
        next(error);
    }
});

const DonationModel = models?.Donations || model('Donations', donationSchema);

export default DonationModel;
