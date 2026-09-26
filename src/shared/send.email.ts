import nodemailer, { SMTPSentMessageInfo, MailComposerOptions } from "nodemailer";
import { randomString, errorLog } from "timonjs";
import CONFIG from "../config";
import { EmailResponse } from "../@types/emailResponse.type";

const transporter = nodemailer.createTransport({
    host: CONFIG.SMTP_HOST,
    port: CONFIG.SMTP_PORT,
    secure: CONFIG.SMTP_SECURE,
    auth: {
        user: CONFIG.SMTP_USER,
        pass: CONFIG.SMTP_PASSWORD,
    },
    logger: false,
    debug: false,
});

export async function verifySMTPConnection(): Promise<boolean> {
    try {
        await transporter.verify();
        console.info("Connection to SMTP server successful.");
        return true;
    } catch (error) {
        console.error("Connection to SMTP server failed:", error);
        return false;
    }
}

verifySMTPConnection();

export async function sendMail(
    recipientEmail: string | string[],
    senderEmail: string,
    senderName: string,
    subject: string,
    text: string,
    html: string,
    files: MailComposerOptions["attachments"] = [],
    id: string = randomString(128),
): Promise<EmailResponse> {
    try {
        const info = await transporter.sendMail({
            from: `${senderName} <${senderEmail}>`,
            to: recipientEmail,
            subject: subject,
            text: text,
            html: html,
            attachments: files.length > 0 ? files : undefined,
            dsn: {
                id: id + "-" + randomString(4),
                return: "full",
                notify: ["failure", "delay"],
                recipient: senderEmail,
            },
        });

        return {
            success: true,
            data: info,
        };
    } catch (error) {
        errorLog(error);
        return {
            success: false,
            data: "An error occurred while sending the email.",
        };
    }
}
