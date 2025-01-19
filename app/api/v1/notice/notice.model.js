import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, fileSchema } = modelShared;

const noticeSchema = new Schema(
    {
        publishDate: stringField('Notice Publish Date', true),
        title: stringField('Notice Title', true),
        fileName: stringField('Notice File Name'),
        file: fileSchema('Notice File'),
        linkName: stringField('Notice Link Name'),
        link: stringField('Notice Link'),
    },
    { timestamps: true }
);

const NoticeModel = models?.Notices || model('Notices', noticeSchema);

export default NoticeModel;
