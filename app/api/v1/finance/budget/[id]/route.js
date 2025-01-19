import serviceShared from '@/shared/service.shared';
import BudgetModel from '@/app/api/v1/finance/budget/budget.model';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import convertToObjectId from '@/util/convertToObjectId';
import budgetPipeline from '@/app/api/v1/finance/budget/budget.pipeline';

const { idValidationSchema } = schemaShared;

// Named export for the GET request handler
const handleGetPaymentMethodTypeById = async (request, context) => {
    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'get',
        idValidationSchema
    );

    const filter = { _id: convertToObjectId(userInput?.id) }; // Add filters if needed
    const projection = {};
    const pipeline = budgetPipeline(filter, projection);

    // Use the common fetchEntryById function to retrieve the data
    return serviceShared.fetchEntryById(
        BudgetModel,
        pipeline,
        'Budget',
        request,
        userInput
    );
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetPaymentMethodTypeById);
