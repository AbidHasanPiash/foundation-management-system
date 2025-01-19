import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, dateField, fileSchema } = modelShared;

const mediaPhotosSchema = new Schema(
    {
        title: stringField('Title', true),
        description: stringField('Description', true),
        date: dateField('Date', true),
        image: fileSchema('Image'),
    },
    { timestamps: true }
);

const MediaPhotoModel =
    models?.MediaPhotos || model('MediaPhotos', mediaPhotosSchema);

export default MediaPhotoModel;
