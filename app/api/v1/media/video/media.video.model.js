import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, dateField } = modelShared;

const mediaVideosSchema = new Schema(
    {
        title: stringField('Media Title', true),
        description: stringField('Media Description', true),
        date: dateField('Media Date', true),
        link: stringField('Media video Link', true),
    },
    { timestamps: true }
);

const MediaVideoModel =
    models?.MediaVideos || model('MediaVideos', mediaVideosSchema);

export default MediaVideoModel;
