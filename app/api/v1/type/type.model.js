import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField } = modelShared;

const typeSchema = new Schema(
    {
        type: stringField('Type', true),
        category: stringField('Type Category', true),
    },
    { timestamps: true }
);

const TypeModel = models?.Types || model('Types', typeSchema);

export default TypeModel;
