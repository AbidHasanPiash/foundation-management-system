import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, fileSchema, fileWithNameSchema, linkWithNameSchema } =
    modelShared;

const newsSchema = new Schema(
    {
        title: stringField('Title', true),
        banner: fileSchema('News Banner'),
        description: stringField('Description', true),
        files: [fileWithNameSchema('News File')],
        links: [linkWithNameSchema('News Link')],
    },
    { timestamps: true }
);

const MediaNewsModel = models?.Newses || model('Newses', newsSchema);

export default MediaNewsModel;
