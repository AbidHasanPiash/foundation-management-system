import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { numberField } = modelShared;

const treasuriesSchema = new Schema(
    {
        balance: numberField('Balance', true, 0, 0),
    },
    { timestamps: true }
);

const TreasuryModel =
    models?.Treasuries || model('Treasuries', treasuriesSchema);

export default TreasuryModel;
