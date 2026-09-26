type ValidationObject = {
    value: string;
    valid: boolean;
};

export interface ContactValidation {
    [name: string]: ValidationObject;
    familyName: ValidationObject;
    email: ValidationObject;
    message: ValidationObject;
}

export type ContactConfirmRequest = {
    token: string;
    timestamp: number;
    verificationCode: string;
    payload: {
        name: string;
        familyName: string;
        email: string;
        message: string;
    };
};
