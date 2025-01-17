type ValidationObject = {
    value: string;
    valid: boolean;
};

export interface LoginValidation {
    [email: string]: ValidationObject;
    password: ValidationObject;
}

export interface Account {
    id: number;
    email: string;
    password: string;
    name: string;
    family_name: string;
    picture: string;
}
