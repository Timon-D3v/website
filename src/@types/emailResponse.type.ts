import { LibraryResponse } from "node-mailjet";
import { RequestData } from "node-mailjet/declarations/request/Request";

export type EmailResponse = {
    success: boolean;
    data: string | LibraryResponse<RequestData>;
};
