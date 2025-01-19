import nodemailer from 'nodemailer';

import logger from '@/lib/logger';

import configurations from '@/configs/configurations';

const configuration = await configurations();

// Create a transporter object with the configuration from environment variables
const transporter = nodemailer.createTransport({
    host: configuration.email.smtp.host,
    port: Number(configuration.email.smtp.port), // Default to port 587 if not specified
    secure: Number(configuration.email.smtp.port) === 465, // Use TLS if port 465
    auth: {
        user: configuration.email.smtp.auth.user,
        pass: configuration.email.smtp.auth.pass,
    },
});

const sendEmail = async (
    emailAddress = configuration.systemAdmin.email,
    subject,
    html
) => {
    try {
        // Send the email using the transporter
        const info = await transporter.sendMail({
            from: configuration.email.from,
            to: emailAddress,
            subject,
            html,
        });

        logger.info(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error('Email sending failed:', error);

        throw new Error('Failed to send email');
    }
};

export default sendEmail;
