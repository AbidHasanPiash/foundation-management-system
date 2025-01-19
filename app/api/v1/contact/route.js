import httpStatusConstants from '@/constants/httpStatus.constants';
import mongodb from '@/lib/mongodb';
import ContactModel from './contact.model';
import contactSchema from '@/app/api/v1/contact/contact.schema';
import contactConstants from '@/app/api/v1/contact/contact.constants';

import sendResponse from '@/util/sendResponse';
import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import sendEmail from '@/lib/email';
import configurations from '@/configs/configurations';

const configuration = await configurations();

// Named export for the GET request handler
const handleSendContactEmail = async (request, context) => {
    const contentValidationResult = validateUnsupportedContent(
        request,
        contactConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        contactSchema
    );

    // Check if the "about" type already exists in MongoDB
    await mongodb.connect();

    // Create a new "about" document with banner details
    await ContactModel.create(userInput);

    const contactData = await ContactModel.findOne(
        {
            name: userInput?.name,
            email: userInput?.email,
        },
        {
            name: 1,
            email: 1,
            subject: 1,
            message: 1,
        }
    ).lean();

    if (!contactData) {
        return sendResponse(
            false,
            httpStatusConstants.UNPROCESSABLE_ENTITY,
            'Failed to save contact email data.',
            {},
            {},
            request
        );
    }

    const receiverEmailSubject = `New message - ${userInput.subject}`;
    const senderEmailSubject = `Thank you for reaching out to us ${userInput.name}!`;
    const receiverHtml = `
            <h3>Dear Admin,</h3>

            <p>We hope this message finds you well. We are reaching out to share some updates from the School Management System.</p>
            
            <h4>🌟 New Message</h4>
            <p>We have received a new message from <strong><u>${userInput.name}</u></strong>:</p>
            <blockquote>
                <p>${userInput.message}</p>
            </blockquote>
            
            <h4>📬 Contact Details:</h4>
            <p>If you'd like to get in touch directly, here are ${userInput.name}'s contact details:</p>
            <ul>
                <li><strong>Email:</strong> ${userInput.email}</li>
            </ul>
            
            <p>Thank you for your attention and have a wonderful day!</p>
    
            <p>Warm regards,</p>
            <p>BCS Management Team</p>
        `;
    const senderHtml = `
            <h3>Dear ${userInput.name},</h3>

            <p>We're glad to inform you that we have successfully received your message.</p>
            <p>We have noted your contact details as follows:</p>
            <ul>
                <li><strong>Email:</strong> ${userInput.email}</li>
            </ul>
            
            <p>Thank you for getting in touch with us! We will respond to your query as soon as possible.</p>

            <p>Warm regards,</p>
            <p>BCS Management Team</p>
        `;

    const sendEmailToSenderResponse = await sendEmail(
        userInput.email,
        senderEmailSubject,
        senderHtml
    );
    if (!sendEmailToSenderResponse.messageId) {
        return sendResponse(
            false,
            httpStatusConstants.UNPROCESSABLE_ENTITY,
            `Failed to send email to sender ${userInput.email}.`,
            {},
            {},
            request
        );
    }

    const sendEmailToReceiverResponse = await sendEmail(
        userInput.email,
        receiverEmailSubject,
        receiverHtml
    );
    if (!sendEmailToReceiverResponse.messageId) {
        return sendResponse(
            false,
            httpStatusConstants.UNPROCESSABLE_ENTITY,
            `Failed to send contact email to receiver ${configuration.systemAdmin.email}.`,
            {},
            {},
            request
        );
    }

    // Send a success response with the created document data
    return sendResponse(
        true,
        httpStatusConstants.OK,
        'Contact email sent successfully.',
        {},
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleSendContactEmail);
