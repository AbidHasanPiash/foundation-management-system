import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, booleanField } = modelShared;

const eventCategorySchema = new Schema(
    {
        category: stringField('Event Category', true, true),
        isSpecial: booleanField('Is Special', false),
    },
    { timestamps: true }
);

const EventCategoryModel =
    models?.EventCategories || model('EventCategories', eventCategorySchema);

export default EventCategoryModel;
