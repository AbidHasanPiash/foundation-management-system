import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField } = modelShared;

const statusSchema = new Schema(
    {
        status: stringField('Status', true),
        category: stringField('Status Category', true),
    },
    { timestamps: true }
);

const StatusModel = models?.Statuses || model('Statuses', statusSchema);

export default StatusModel;
