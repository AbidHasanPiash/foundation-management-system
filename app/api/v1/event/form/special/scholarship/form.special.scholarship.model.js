import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const {
    stringField,
    booleanField,
    refField,
    fileSchema,
    addressSchema,
    dateField,
} = modelShared;

const examSchema = new Schema({
    subject: stringField('Exam Subject', true),
    date: dateField('Exam Date', true),
    time: stringField('Exam Time', true),
});

// Form Data Schema
const formSchema = new Schema({
    slNo: stringField('Serial Number', false),
    statusId: refField('Statuses', 'Event Form Status ID', true),
    applicantNameBn: stringField('Applicant Name (Bangla)', true),
    applicantNameEn: stringField('Applicant Name (English)', true),
    fatherName: stringField("Father's Name", true),
    motherName: stringField("Mother's Name", true),
    schoolName: stringField('School Name', true),
    classRollNo: stringField('Class Roll Number', true),
    contact: stringField('Contact Number', true),
    image: fileSchema('Form Special Scholarship Image'),
    permanentAddress: addressSchema('Permanent Address'),
    isCurrentAddressSameAsPermanentAddress: booleanField(
        'Is Current Address Same As Permanent Address',
        false
    ),
    currentAddress: {
        type: addressSchema('Current Address'),
        required() {
            return !this.isCurrentAddressSameAsPermanentAddress;
        },
    },
});

const formSpecialScholarshipSchema = new Schema(
    {
        slNo: stringField('Serial Number', true),
        formCode: stringField('Form Code', false),
        formTitle: stringField('Event Name', true),
        formName: stringField('Form Name', true),
        venue: stringField('Venue Name', true),
        lastDate: dateField('Form Submit Last Date', true),
        eligibleSchools: [
            refField(
                'FormSpecialEligibleSchools',
                'Eligible Institute ID',
                true
            ),
        ],
        exam: {
            type: [examSchema],
            validate: {
                validator(v) {
                    return v && v.length > 0;
                },
                message: 'Exam details are required',
            },
        },
        note: {
            type: [String],
            required: [true, 'At least one note is required'],
            validate: {
                validator(v) {
                    return v && v.length > 0;
                },
                message: 'Notes cannot be empty',
            },
        },
        isActive: booleanField('Is Active', false),
        data: {
            type: [formSchema], // Array of FormSchema data
        },
    },
    {
        timestamps: true,
    }
);

const FormSpecialScholarshipModel =
    models?.FormSpecialScholarships ||
    model('FormSpecialScholarships', formSpecialScholarshipSchema);

export default FormSpecialScholarshipModel;
