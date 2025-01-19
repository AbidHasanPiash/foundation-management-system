import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, refField } = modelShared;

const eventSubCategorySchema = new Schema(
    {
        category: refField('EventCategories', 'Event Category', true),
        subCategory: stringField('Event Sub Category', true, true),
    },
    { timestamps: true }
);

const EventSubCategoryModel =
    models?.EventSubCategories ||
    model('EventSubCategories', eventSubCategorySchema);

export default EventSubCategoryModel;
