import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField } = modelShared;

const formSpecialEligibleInstituteSchema = new Schema(
    {
        name: stringField('Institute Name', true),
        address: stringField('Institute Address', true),
        contactPerson: stringField('Contact Person', true),
        contactNo: stringField('Contact Number', true),
        headOfInstitute: stringField('Head of Institute Name', true),
        headOfInstituteNumber: stringField(
            'Head of Institute Contact Number',
            true
        ),
    },
    {
        timestamps: true,
    }
);

const FormSpecialEligibleInstituteModel =
    models?.FormSpecialEligibleInstitutes ||
    model('FormSpecialEligibleInstitutes', formSpecialEligibleInstituteSchema);

export default FormSpecialEligibleInstituteModel;
