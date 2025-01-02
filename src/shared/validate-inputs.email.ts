import { ContactValidation } from "../@types/contactValidation.type";

export function validateData(name: string, familyName: string, email: string, message: string): [boolean, ContactValidation, { title: string; message: string }] {
    const error = {
        title: "",
        message: "",
    };

    const setError = (title: string, message: string) => {
        if (error.title === "") error.title = title;
        if (error.message === "") error.message = message;
    };

    const result: ContactValidation = {
        name: {
            value: name.trim(),
            valid: false,
        },
        familyName: {
            value: familyName.trim(),
            valid: false,
        },
        email: {
            value: email.trim(),
            valid: false,
        },
        message: {
            value: message.trim(),
            valid: false,
        },
    };

    let valid = true;

    for (const key in result) {
        result[key].valid = result[key].value === "" ? false : true;

        if (!result[key].valid) {
            valid = false;
            setError("Fehler", "Bitte füllen Sie alle Felder aus.");
        }
    }

    // Check if email is valid
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email.value)) {
        result.email.valid = false;
        valid = false;
        setError("Fehler", "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    }

    if (result.message.value.length < 10) {
        result.message.valid = false;
        valid = false;
        setError("Fehler", "Ihre Nachricht muss mindestens 10 Zeichen lang sein.");
    }

    return [valid, result, error];
}
