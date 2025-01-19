import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const {
    stringField,
    dateField,
    booleanField,
    refField,
    fileSchema,
    addressSchema,
} = modelShared;

const memberSchema = new Schema(
    {
        name: stringField('Name', true),
        email: stringField('Email', true, true),
        phone: stringField('Phone', true, true),
        password: stringField('Password', true),
        image: fileSchema('Member Image'), // Embedded file schema for image
        nid: stringField('NID', true, true),
        educationalBackground: stringField('Educational Background', true),
        occupation: stringField('Occupation', true),
        workplace: stringField('Workplace', true),
        designation: stringField('Designation', true),
        bloodGroup: stringField('Blood Group', true),
        dob: dateField('Date of Birth', true),
        fatherName: stringField("Father's Name", true),
        spouseName: stringField("Spouse's Name", false),
        motherName: stringField("Mother's Name", true),
        permanentAddress: addressSchema('Member'),
        isCurrentAddressSameAsPermanentAddress: booleanField(
            'Is Current Address Same As Permanent Address',
            false
        ),
        currentAddress: addressSchema('Member'),
        typeId: refField('Types', 'Type ID'),
        statusId: refField('Statuses', 'Status ID'),
        memberId: stringField('Member ID'),
        joinDate: dateField('Join Date', true),
    },
    { timestamps: true }
);

const MemberModel = models?.Members || model('Members', memberSchema);

export default MemberModel;
