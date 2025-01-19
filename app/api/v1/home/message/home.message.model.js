import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, fileSchema } = modelShared;

const aboutSchema = new Schema(
    {
        title: stringField('Title', true, true),
        name: stringField('Name', true),
        message: stringField('Message', true),
        image: fileSchema('Image'),
    },
    { timestamps: true }
);

const HomeMessageModel =
    models?.HomeMessages || model('HomeMessages', aboutSchema);

export default HomeMessageModel;
