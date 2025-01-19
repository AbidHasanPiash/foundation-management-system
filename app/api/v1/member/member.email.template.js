import sendEmail from '@/lib/email';

// Utility function to send a new account creation email with a temporary password
const accountCreationSuccessfulNotification = async (
    email,
    name,
    tempPassword
) => {
    const subject = 'Welcome to BCS Management - Your Account Details';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>Welcome to BCS Management! Your account has been successfully created.</p>
        
        <p>Here are your temporary login credentials:</p>
        <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Temporary Password:</strong> ${tempPassword}</li>
        </ul>
        
        <p>We recommend changing your password as soon as you log in for the first time.</p>
        
        <p>If you did not request this account, please contact our support team immediately.</p>
        
        <p>Thank you for joining us!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

const memberEmailTemplate = {
    accountCreationSuccessfulNotification,
};

export default memberEmailTemplate;
