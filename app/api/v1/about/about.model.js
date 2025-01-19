import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, fileSchema } = modelShared;

const typeSchema = new Schema(
    {
        type: stringField('Type', true, true),
        category: stringField('Category', true),
        title: stringField('Title', true),
        description: stringField('Description', true),
        banner: fileSchema('About Banner'),
    },
    { timestamps: true }
);

const AboutModel = models?.Abouts || model('Abouts', typeSchema);

export default AboutModel;
