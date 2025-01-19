import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, fileSchema } = modelShared;

const homeCarouselSchema = new Schema(
    {
        title: stringField('Title', true, true),
        image: fileSchema('Image'),
    },
    { timestamps: true }
);

const HomeCarouselModel =
    models?.HomeCarousels || model('HomeCarousels', homeCarouselSchema);

export default HomeCarouselModel;
