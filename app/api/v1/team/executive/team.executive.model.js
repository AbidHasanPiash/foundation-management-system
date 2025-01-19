import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, fileSchema, dateField } = modelShared;

const executiveSchema = new Schema(
    {
        name: stringField('Name', true),
        email: stringField('Email', true, true),
        image: fileSchema('Image'),
        typeId: stringField('Type ID', true),
        statusId: stringField('Status ID', true),
        joinDate: dateField('Join Date', true),
        designation: stringField('Designation', true),
        organization: stringField('Organization', true),
    },
    { timestamps: true }
);

const TeamExecutiveModel =
    models?.Executives || model('Executives', executiveSchema);

export default TeamExecutiveModel;
