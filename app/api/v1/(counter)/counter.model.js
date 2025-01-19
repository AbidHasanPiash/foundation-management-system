import { Schema, model, models } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, numberField } = modelShared;

const counterSchema = new Schema({
    _id: stringField('Counter ID', true),
    seq: numberField('Sequence', true, 0, 0, {
        validator: Number.isInteger,
        message: 'Sequence number must be an integer.',
    }),
});

const CounterModel = models?.Counters || model('Counters', counterSchema);

export default CounterModel;
