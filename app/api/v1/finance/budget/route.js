import serviceShared from '@/shared/service.shared';
import BudgetModel from '@/app/api/v1/finance/budget/budget.model';

import asyncHandler from '@/util/asyncHandler';
import budgetPipeline from '@/app/api/v1/finance/budget/budget.pipeline';

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
export const GET = asyncHandler(handleGetBudgetList);
