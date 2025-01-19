import sendEmail from '@/lib/email';

// Utility function to send a login notification email
const successfulLoginNotification = async (email, name, deviceType) => {
    const subject = 'New login detected';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>A new login was detected from a ${deviceType} device on your account.</p>
        <p>If this wasn't you, please contact support immediately.</p>
        
        <p>Thank you for being with us!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

// Utility function to send a failed login notification email
const failedLoginNotification = async (email, name, deviceType) => {
    const subject = 'Failed login attempt detected';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>We detected a failed login attempt on your account from a ${deviceType} device.</p>
        <p>If this was you, please ensure you are using the correct credentials.</p>
        <p>If this wasn't you, we strongly recommend updating your password and contacting support immediately.</p>
        
        <p>Thank you for being with us!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

// Utility function to send a failed login notification email
const resetPasswordRequestNotification = async (email, name, resetLink) => {
    const subject = 'Reset Your Password';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>We received a request to reset your password.</p>
        <p>If you made this request, please click the link below to reset your password:</p>
        <p><a href="${resetLink}" style="color: #007bff; text-decoration: none;">Reset My Password</a></p>
        <p>This link will expire in 5 min. If you did not request a password reset, you can safely ignore this email.</p>
        
        <p>Thank you for being with us!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

// Utility function to send a successful password reset notification email
const resetPasswordSuccessfulNotification = async (email, name) => {
    const subject = 'Password Reset Successful';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>Your password has been successfully reset.</p>
        <p>If you did not request this password reset, please contact our support team immediately.</p>
        
        <p>Thank you for being with us!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

// Utility function to send a failed password reset notification email
const resetPasswordFailedNotification = async (email, name) => {
    const subject = 'Password Reset Failed';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>We attempted to reset your password, but the request could not be completed due to an issue.</p>
        <p>This could happen if the reset link has expired or is invalid.</p>
        <p>If you still need to reset your password, please request a new password reset link and try again.</p>
        
        <p>If this wasn't you, please contact our support team immediately.</p>
        
        <p>Thank you for being with us!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

const authEmailTemplate = {
    successfulLoginNotification,
    failedLoginNotification,
    resetPasswordRequestNotification,
    resetPasswordSuccessfulNotification,
    resetPasswordFailedNotification,
};

export default authEmailTemplate;
