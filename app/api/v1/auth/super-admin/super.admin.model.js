import { Schema, models, model } from 'mongoose';

const superAdminSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        dateOfBirth: {
            type: String, // Use `Date` if you want date parsing, or `String` for flexibility in formats
            required: [true, 'Date of Birth is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            validate: {
                validator(value) {
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(
                        value
                    );
                },
                message:
                    'Password must contain an uppercase letter, lowercase letter, number, and special character',
            },
        },
        emailVerifyToken: {
            type: String,
            trim: true,
            description:
                "Token used to verify the (users)'s identity for account creation process.",
        },
        resetPasswordToken: {
            type: String,
            trim: true,
            description:
                "Token used to verify the (users)'s identity for password reset process.",
        },
        resetPasswordTokenExpiration: {
            type: Date,
            trim: true,
            description:
                ' Expiration date and time for the reset password verification token.',
        },
    },
    { timestamps: true }
);

// Virtual field for confirmPassword
superAdminSchema
    .virtual('confirmPassword')
    .get(function () {
        return this._confirmPassword;
    })
    .set(function (value) {
        this._confirmPassword = value;
    });

// Password match validation before saving
superAdminSchema.pre('save', function (next) {
    if (this.password !== this._confirmPassword) {
        const err = new Error('Passwords must match');
        next(err);
    } else {
        next();
    }
});

const AdminModel =
    models?.SuperAdmins || model('SuperAdmins', superAdminSchema);

export default AdminModel;
