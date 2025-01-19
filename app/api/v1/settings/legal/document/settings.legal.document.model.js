import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, fileWithNameSchema } = modelShared;

const settingsLegalDocumentSchema = new Schema(
    {
        title: stringField('Title', true),
        effectiveDate: stringField('Effective Date', true),
        description: stringField('Description', true),
        documents: [fileWithNameSchema('Document')],
    },
    { timestamps: true }
);

const SettingsLegalDocumentModel =
    models?.SettingsLegalDocuments ||
    model('SettingsLegalDocuments', settingsLegalDocumentSchema);

export default SettingsLegalDocumentModel;
