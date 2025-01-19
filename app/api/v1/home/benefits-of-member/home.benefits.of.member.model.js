import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField } = modelShared;

const benefitsOfMembersSchema = new Schema(
    {
        text: stringField('Title', true),
    },
    { timestamps: true }
);

const HomeBenefitsOfMemberModel =
    models?.BenefitsOfMembers ||
    model('BenefitsOfMembers', benefitsOfMembersSchema);

export default HomeBenefitsOfMemberModel;
