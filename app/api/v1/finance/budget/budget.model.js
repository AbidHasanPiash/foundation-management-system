import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, numberField, refField, dateField } = modelShared;

// Schema for budget entries (allowances)
const allowanceSchema = new Schema({
    purpose: stringField('Budget Purpose', true),
    note: stringField('Budget Note', true),
    paymentDetails: stringField('Budget Payment Details', true),
    budgetAmount: numberField('Budget Amount', true, 0, 0),
    actualAmount: numberField('Actual Amount', true, 0, 0),
    date: dateField('Date'), // Default date set to `Date.now`
});

// Main Budget Schema
const budgetSchema = new Schema(
    {
        eventId: refField('Events', 'Event ID', true),
        budget: {
            type: [allowanceSchema],
            required: [true, 'Budget entries are required.'],
        },
        description: stringField('Description', false),
        totalBudgetAmount: numberField('Total Budget Amount', false, 0),
        totalActualAmount: numberField('Total Actual Amount', false, 0),
    },
    {
        timestamps: true,
    }
);

// Function to recalculate the total amounts for budget and actuals
const calculateTotalBudgetAmount = (budgetEntries) =>
    budgetEntries &&
    budgetEntries?.reduce((sum, item) => sum + item.budgetAmount, 0);

// Function to recalculate the total amounts for budget and actuals
const calculateTotalActualAmount = (budgetEntries) =>
    budgetEntries &&
    budgetEntries?.reduce((sum, item) => sum + item.actualAmount, 0);

// Pre-save hook to recalculate totals before saving
budgetSchema.pre('save', function (next) {
    this.totalBudgetAmount = calculateTotalBudgetAmount(this.budget);
    this.totalActualAmount = calculateTotalActualAmount(this.budget);

    next();
});

// Pre-update hook to recalculate totals before updating
budgetSchema.pre('findOneAndUpdate', function (next) {
    this.totalBudgetAmount = calculateTotalBudgetAmount(this.budget);
    this.totalActualAmount = calculateTotalActualAmount(this.budget);

    next();
});

// Post save hook to handle any additional logic or cleanup (if needed)
budgetSchema.post('save', (doc, next) => {
    next();
});

const BudgetModel = models?.Budgets || model('Budgets', budgetSchema);

export default BudgetModel;
