import Mailjet from "node-mailjet";
import { randomString, errorLog } from "timonjs";
import CONFIG from "../config";
import { EmailResponse } from "../@types/emailResponse.type";

const mailjet = new Mailjet({
    apiKey: CONFIG.MAILJET_PUBLIC_KEY,
    apiSecret: CONFIG.MAILJET_PRIVATE_KEY,
});

export async function sendMail(to: string | { Email: string }[], from: string, name: string, subject: string, text: string, html: string, files: Array<any> = [], id: string = randomString(16)): Promise<EmailResponse> {
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
