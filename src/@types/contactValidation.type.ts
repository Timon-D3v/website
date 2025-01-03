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
