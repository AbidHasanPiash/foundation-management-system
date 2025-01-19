import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, booleanField, refField, fileSchema, addressSchema } =
    modelShared;

// Form Data Schema
const formSchema = new Schema({
    slNo: stringField('Serial Number'),
    statusId: refField('Statuses', 'Event Form Status ID', true),
    applicantNameBn: stringField('Applicant Name (Bangla)', true),
    applicantNameEn: stringField('Applicant Name (English)', true),
    image: fileSchema('File'),
    dob: stringField('Date of Birth', true),
    bloodGroup: stringField('Blood Group', true),
    fatherName: stringField("Father's Name", true),
    motherName: stringField("Mother's Name", true),
    alternativeGuardianName: stringField('Alternative Guardian Name'),
    alternativeGuardianAddress: stringField('Alternative Guardian Address'),
    contact: stringField('Contact Number', true),
    fatherOrGuardianOccupation: stringField('Father/Guardian Occupation'),
    fatherOrGuardianMonthlyIncome: stringField(
        'Father/Guardian Monthly Income'
    ),
    permanentAddress: addressSchema('Permanent Address'),
    isCurrentAddressSameAsPermanentAddress: booleanField(
        'Is Current Address Same As Permanent Address',
        false
    ),
    currentAddress: addressSchema('Current Address'),
    hasPreviousScholarship: booleanField('Has Previous Scholarship', false),
    previousScholarshipAmount: stringField('Previous Scholarship Amount'),
    schoolName: stringField('School Name', true),
    schoolAddress: stringField('School Address'),
    aimInLife: stringField('Aim in Life'),
    lastFinalExaminationDetails: {
        examName: stringField('Exam Name'),
        examYear: stringField('Exam Year'),
        instituteName: stringField('Institute Name'),
        boardName: stringField('Board Name'),
        totalMarks: stringField('Total Marks'),
    },
    lastFinalExaminationResults: [
        {
            subject: stringField('Subject'),
            marks: stringField('Marks'),
        },
    ],
    applicantBankDetails: {
        bankName: stringField('Bank Name'),
        bankBranchName: stringField('Bank Branch Name'),
        bKashNumber: stringField('bKash Number'),
    },
    monthlyEducationalCost: stringField('Monthly Educational Cost'),
    familyMemberCount: stringField('Family Member Count'),
    siblings: [
        {
            name: stringField('Sibling Name'),
            age: stringField('Sibling Age'),
            class: stringField('Sibling Class'),
            occupation: stringField('Sibling Occupation'),
        },
    ],
    extracurricularSkills: stringField('Extracurricular Skills'),
    futureThoughtsAboutOurOrganization: stringField(
        'Future Thoughts About Our Organization'
    ),
});

const talentPoolScholarshipFormInfoSchema = new Schema(
    {
        slNo: stringField('Serial Number', true),
        formCode: stringField('Form Code', false),
        formTitle: stringField('Event Name', true),
        formName: stringField('Form Name', true),
        scholarshipType: stringField('Scholarship Type', true),
        scholarshipAmount: {
            type: Number,
            required: [true, 'Scholarship amount is required'],
        },
        note: {
            type: [stringField('Note', true).type],
            validate: {
                validator(v) {
                    return v && v.length > 0;
                },
                message: 'At least one note is required',
            },
        },
        contact: {
            type: [stringField('Contact', true).type],
            validate: {
                validator(v) {
                    return v && v.length > 0;
                },
                message: 'At least one contact number is required',
            },
        },
        email: stringField('Email', true),
        isActive: booleanField('Is Active', false),
        data: {
            type: [formSchema], // Array of FormSchema data
        },
    },
    {
        timestamps: true,
    }
);

const FormSpecialTalentPoolScholarshipModel =
    models?.FormSpecialTalentPoolScholarships ||
    model(
        'FormSpecialTalentPoolScholarships',
        talentPoolScholarshipFormInfoSchema
    );

export default FormSpecialTalentPoolScholarshipModel;
