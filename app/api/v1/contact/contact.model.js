import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField } = modelShared;

const contactSchema = new Schema(
    {
        name: stringField('Name', true),
        email: stringField('Email', true),
        subject: stringField('Subject', true),
        message: stringField('Message', true),
    },
    { timestamps: true }
);

const ContactModel = models?.Contacts || model('Contacts', contactSchema);

export default ContactModel;
