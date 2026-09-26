import { SMTPSentMessageInfo } from "nodemailer/lib/smtp-transport";

export type EmailResponse = {
    success: boolean;
    data: string | SMTPSentMessageInfo;
};
