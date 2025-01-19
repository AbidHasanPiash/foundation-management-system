import sendEmail from '@/lib/email';

// Utility function to send a successful donation receipt email to the user
const sendDonationReceiptToUser = async (email, name, amount, donationDate) => {
    const subject = 'Thank You for Your Donation!';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>We are thrilled to confirm that we have successfully received your donation of <strong>$${amount.toFixed(
            2
        )}</strong> on <strong>${donationDate}</strong>.</p>
        
        <p>Your generous contribution makes a meaningful impact and helps us continue our mission.</p>
        <p>If you have any questions regarding your donation, please do not hesitate to contact us.</p>
        
        <p>Thank you for your support!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

// Utility function to send a successful donation notification email to the admin
const sendDonationNotificationToAdmin = async (
    adminEmail,
    userName,
    amount,
    donationDate
) => {
    const subject = 'New Donation Received';
    const htmlContent = `
        <h3>Admin,</h3>
        
        <p>We are pleased to inform you that a donation has been successfully made:</p>
        <ul>
            <li><strong>Donor Name:</strong> ${userName}</li>
            <li><strong>Donation Amount:</strong> ৳${amount.toFixed(2)}</li>
            <li><strong>Date:</strong> ${donationDate}</li>
        </ul>
        
        <p>Please ensure the donation is recorded in the system and any necessary follow-ups are handled promptly.</p>
        
        <p>Thank you for overseeing our operations!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(adminEmail, subject, htmlContent);
};

// Utility function to send a failed donation notification email to the user
const sendFailedDonationNotificationToUser = async (
    email,
    name,
    attemptedAmount,
    failureReason
) => {
    const subject = 'Donation Attempt Failed';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>We regret to inform you that your donation attempt of <strong>৳${attemptedAmount.toFixed(
            2
        )}</strong> could not be processed.</p>
        
        <p><strong>Reason:</strong> ${failureReason}</p>
        
        <p>Please double-check your payment details and try again. If the issue persists, feel free to contact our support team for assistance.</p>
        
        <p>We deeply appreciate your willingness to support us and apologize for the inconvenience caused.</p>
        
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

// Utility function to send a failed donation notification email to the admin
const sendFailedDonationNotificationToAdmin = async (
    adminEmail,
    userName,
    attemptedAmount,
    failureReason
) => {
    const subject = 'Donation Attempt Failed';
    const htmlContent = `
        <h3>Admin,</h3>
        
        <p>A donation attempt by <strong>${userName}</strong> failed to process.</p>
        <ul>
            <li><strong>Donor Name:</strong> ${userName}</li>
            <li><strong>Attempted Donation Amount:</strong> ৳${attemptedAmount.toFixed(2)}</li>
            <li><strong>Reason:</strong> ${failureReason}</li>
        </ul>
        
        <p>Please investigate the issue and reach out to the donor if necessary.</p>
        
        <p>Thank you for your attention to this matter!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(adminEmail, subject, htmlContent);
};

// Utility function to send a successful budget creation email
const sendBudgetCreationSuccessEmailToAdmin = async (
    email,
    eventId,
    eventTitle,
    budgetAmount
) => {
    const subject = 'Budget Creation Successful';
    const htmlContent = `
        <h3>Admin,</h3>
        
        <p>We are pleased to inform you that a budget has been successfully created for the following event:</p>
        <ul>
            <li><strong>Event ID:</strong> ${eventId}</li>
            <li><strong>Event Title:</strong> ${eventTitle}</li>
            <li><strong>Budget Amount:</strong> ৳${budgetAmount.toFixed(2)}</li>
        </ul>
        
        <p>Thank you for your continuous support and efforts in managing the event finances. If you have any questions or need further assistance, please don't hesitate to contact us.</p>
        
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

// Utility function to send a failed budget creation email
const sendBudgetCreationFailedEmailToAdmin = async (
    email,
    eventId,
    eventTitle,
    budgetAmount,
    failureReason
) => {
    const subject = 'Budget Creation Failed';
    const htmlContent = `
        <h3>Admin,</h3>
        
        <p>We regret to inform you that the budget creation for the following event could not be completed:</p>
        <ul>
            <li><strong>Event ID:</strong> ${eventId}</li>
            <li><strong>Event Title:</strong> ${eventTitle}</li>
            <li><strong>Budget Amount:</strong> ৳${budgetAmount.toFixed(2)}</li>
        </ul>
        
        <p><strong>Reason:</strong> ${failureReason}</p>
        
        <p>Please review the request and try again. If the issue persists, contact our support team for assistance.</p>
        
        <p>We apologize for the inconvenience and appreciate your understanding.</p>
        
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

// Utility function to send a failed budget creation email
const sendRecalculationAttemptEmailToAdmin = async (
    email,
    eventId,
    eventTitle,
    budgetAmount,
    failureReason
) => {
    const subject = 'Attempted recalculation of actual budget';
    const htmlContent = `
        <h3>Admin,</h3>
        
        <p>An attempt was made to recalculate the actual budget.</p>
        <ul>
            <li><strong>Event ID:</strong> ${eventId}</li>
            <li><strong>Event Title:</strong> ${eventTitle}</li>
            <li><strong>Budget Amount:</strong> ৳${budgetAmount.toFixed(2)}</li>
        </ul>

        <p><strong>Reason:</strong> ${failureReason}</p>

        <p>Please review the request and try again. If the issue persists, contact our support team for assistance.</p>

        <p>We apologize for the inconvenience and appreciate your understanding.</p>

        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

const financeEmailTemplate = {
    sendDonationReceiptToUser,
    sendDonationNotificationToAdmin,
    sendFailedDonationNotificationToUser,
    sendFailedDonationNotificationToAdmin,

    sendBudgetCreationSuccessEmailToAdmin,
    sendBudgetCreationFailedEmailToAdmin,
    sendRecalculationAttemptEmailToAdmin,
};

export default financeEmailTemplate;
