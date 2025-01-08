import Mailjet from "node-mailjet";
import { randomString, errorLog } from "timonjs";
import CONFIG from "../config";
import { EmailResponse } from "../@types/emailResponse.type";
import { MailjetAttachment } from "../@types/attachment.mailjet.type";

const mailjet = new Mailjet({
    apiKey: CONFIG.MAILJET_PUBLIC_KEY,
    apiSecret: CONFIG.MAILJET_PRIVATE_KEY,
});

/**
 * Sends an email using the Mailjet API.
 *
 * @param {string | { Email: string }[]} to - The recipient's email address or an array of objects containing email addresses.
 * @param {string} from - The sender's email address.
 * @param {string} name - The sender's name.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text content of the email.
 * @param {string} html - The HTML content of the email.
 * @param {MailjetAttachment[]} [files=[]] - An array of files to attach to the email. Defaults to an empty array.
 * @param {string} [id=randomString(16)] - A custom ID for the email. Defaults to a random 16-character string.
 * @returns {Promise<EmailResponse>} A promise that resolves to an EmailResponse object indicating the success or failure of the email sending operation.
 */
export async function sendMail(to: string | { Email: string }[], from: string, name: string, subject: string, text: string, html: string, files: Array<MailjetAttachment> = [], id: string = randomString(16)): Promise<EmailResponse> {
    try {
        const toEmail =
            typeof to === "string"
                ? [
                      {
                          Email: to,
                      },
                  ]
                : to;

        const response = await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: from,
                        Name: name,
                    },
                    To: toEmail,
                    Subject: subject,
                    TextPart: text,
                    HTMLPart: html,
                    CustomID: id,
                    Attachments: files,
                },
            ],
        });
        return {
            success: true,
            data: response,
        };
    } catch (error) {
        errorLog(error);
        return {
            success: false,
            data: "An error occurred while sending the email.",
        };
    }
}
