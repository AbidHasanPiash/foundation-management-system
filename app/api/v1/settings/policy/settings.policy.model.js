import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField } = modelShared;

const settingsPolicySchema = new Schema(
    {
        type: stringField('Type', true, true),
        title: stringField('Title', true),
        description: stringField('Description', true),
    },
    { timestamps: true }
);

const SettingsPolicyModel =
    models?.SettingsPolicies || model('SettingsPolicies', settingsPolicySchema);

export default SettingsPolicyModel;
