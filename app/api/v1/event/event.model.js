import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const {
    refField,
    stringField,
    fileSchema,
    fileWithNameSchema,
    linkWithNameSchema,
} = modelShared;

const eventSchema = new Schema(
    {
        categoryId: refField('EventCategories', 'Event Category ID', true),
        subcategoryId: refField(
            'EventSubCategories',
            'Event Subcategory ID',
            true
        ),
        statusId: refField('Statuses', 'Event Status ID', true),
        specialFormId: refField('FormSpecials', 'Special Form ID'),
        title: stringField('Event Title', true, true),
        eventDate: stringField('Event Date', true),
        description: stringField('Event Description', true),
        banner: fileSchema('Event Banner'),
        files: [fileWithNameSchema('Event File')],
        links: [linkWithNameSchema('Event Link')],
    },
    { timestamps: true }
);

const EventModel = models?.Events || model('Events', eventSchema);

export default EventModel;
