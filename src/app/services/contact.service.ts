import { inject, Injectable } from "@angular/core";
import { ContactValidation } from "../../@types/contactValidation.type";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ContactService {
    http = inject(HttpClient);

    /**
     * Validates the provided contact data.
     *
     * @param {string} name - The first name of the contact.
     * @param {string} familyName - The family name of the contact.
     * @param {string} email - The email address of the contact.
     * @param {string} message - The message from the contact.
     * @returns {[boolean, ContactValidation, { title: string; message: string }]} A tuple containing:
     *   - A boolean indicating whether the data is valid.
     *   - An object representing the validation status of each field.
     *   - An error object with a title and message if validation fails.
     */
    validateData(name: string, familyName: string, email: string, message: string): [boolean, ContactValidation, { title: string; message: string }] {
        const error = {
            title: "",
            message: "",
        };

        /**
         * Sets the error title and message if they are currently empty.
         *
         * @param title - The title to set if the current error title is empty.
         * @param message - The message to set if the current error message is empty.
         *
         * @returns {void}
         */
        const setError = (title: string, message: string): void => {
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

    /**
     * Sends contact form data to the server.
     *
     * @param {ContactValidation} data - The contact form data to be sent.
     * @returns {Observable<any>} An observable of the HTTP response.
     *
     * @example
     * ```typescript
     * const contactData: ContactValidation = {
     *   name: { value: 'John' },
     *   familyName: { value: 'Doe' },
     *   email: { value: 'john.doe@example.com' },
     *   message: { value: 'Hello, this is a message.' }
     * };
     *
     * contactService.sendData(contactData).subscribe(response => {
     *   console.log('Form submitted successfully', response);
     * }, error => {
     *   console.error('Error submitting form', error);
     * });
     * ```
     */
    sendData(data: ContactValidation): Observable<any> {
        const request = this.http.post("/api/public/submitContactForm", {
            name: data["name"].value,
            familyName: data.familyName.value,
            email: data.email.value,
            message: data.message.value,
        });

        request.pipe(
            catchError((error) => {
                console.error(error);
                return error;
            }),
        );

        return request;
    }
}
