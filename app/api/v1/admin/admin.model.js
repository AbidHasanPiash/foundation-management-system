import { Schema, models, model } from 'mongoose';

import modelShared from '@/shared/model.shared';

const { stringField, dateField, passwordField } = modelShared;

const adminSchema = new Schema(
    {
        name: stringField('Name', true),
        dateOfBirth: stringField('Date of Birth', true),
        email: stringField('Email', true, true),
        password: passwordField('Password', true, 8, 20),
        emailVerifyToken: stringField('Email Verify Token'),
        resetPasswordToken: stringField('Reset Password Token'),
        resetPasswordTokenExpiration: dateField(
            'Reset Password Token Expiration'
        ),
    },
    { timestamps: true }
);

// Virtual field for confirmPassword
adminSchema
    .virtual('confirmPassword')
    .get(function () {
        return this._confirmPassword;
    })
    .set(function (value) {
        this._confirmPassword = value;
    });

// Password match validation before saving
adminSchema.pre('save', function (next) {
    if (this.password !== this._confirmPassword) {
        const err = new Error('Passwords must match');
        next(err);
    } else {
        next();
    }
});

const AdminModel = models?.Admins || model('Admins', adminSchema);

export default AdminModel;
