import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, fileSchema, dateField } = modelShared;

const settingsGeneralSchema = new Schema(
    {
        name: stringField('Name', true),
        description: stringField('Description', true),
        startDate: dateField('Start Date', true),
        logo: fileSchema('Logo'),
        address: stringField('Address', false),
        emails: {
            type: [stringField('Email').type], // Array of strings for emails
            required: [true, 'At least one email is required.'],
            validate: {
                validator: (v) => v && v.length > 0,
                message: 'At least one email is required.',
            },
        },
        contacts: {
            type: [stringField('Contact').type], // Array of strings for contacts
            required: [true, 'At least one contact is required.'],
            validate: {
                validator: (v) => v && v.length > 0,
                message: 'At least one contact is required.',
            },
        },
        socialLinks: {
            type: [stringField('Social Link').type], // Array of strings for social links
            required: [true, 'At least one social link is required.'],
            validate: {
                validator: (v) => v && v.length > 0,
                message: 'At least one social link is required.',
            },
        },
    },
    { timestamps: true }
);

const SettingsGeneralModel =
    models?.SettingsGenerals ||
    model('SettingsGenerals', settingsGeneralSchema);

export default SettingsGeneralModel;
