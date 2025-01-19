import { Schema } from 'mongoose';

const donorMembershipSchema = new Schema(
    {
        memberId: {
            type: String,
            required: [true, 'Member ID is required'],
            trim: true,
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
            unique: true,
        },
        image: {
            id: {
                type: String,
                required: [true, 'Image ID is required'],
                trim: true,
            },
            link: {
                type: String,
                required: [true, 'Image link is required'],
                trim: true,
            },
        },
        nid: {
            type: String,
            required: [true, 'NID is required'],
            trim: true,
            unique: true,
        },
        educationalBackground: {
            type: String,
            required: [true, 'Educational background is required'],
            trim: true,
        },
        occupation: {
            type: String,
            required: [true, 'Occupation is required'],
            trim: true,
        },
        workplace: {
            type: String,
            required: [true, 'Workplace is required'],
            trim: true,
        },
        designation: {
            type: String,
            required: [true, 'Designation is required'],
            trim: true,
        },
        bloodGroup: {
            type: String,
            required: [true, 'Blood group is required'],
            trim: true,
        },
        dob: {
            type: Date,
            required: [true, 'Date of birth is required'],
            trim: true,
        },
        fatherName: {
            type: String,
            required: [true, 'Father’s name is required'],
            trim: true,
        },
        spouseName: {
            type: String,
            required: false,
            trim: true,
        },
        motherName: {
            type: String,
            required: [true, 'Mother’s name is required'],
            trim: true,
        },
        permanentAddress: {
            village: {
                type: String,
                required: [true, 'Permanent address village is required'],
                trim: true,
            },
            postOffice: {
                type: String,
                required: [true, 'Permanent address post office is required'],
                trim: true,
            },
            subdistrict: {
                type: String,
                required: [true, 'Permanent address subdistrict is required'],
                trim: true,
            },
            district: {
                type: String,
                required: [true, 'Permanent address district is required'],
                trim: true,
            },
        },
        isCurrentAddressSameAsPermanentAddress: {
            type: Boolean,
            required: false,
            default: false,
        },
        currentAddress: {
            village: {
                type: String,
                trim: true,
            },
            postOffice: {
                type: String,
                trim: true,
            },
            subdistrict: {
                type: String,
                trim: true,
            },
            district: {
                type: String,
                trim: true,
            },
        },
        initialDonation: {
            type: Number,
            required: false,
            default: null,
        },
    },
    { timestamps: true }
);

export default donorMembershipSchema;
