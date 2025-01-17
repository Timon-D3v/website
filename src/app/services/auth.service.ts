import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { LoginValidation } from "../../@types/auth.type";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    http = inject(HttpClient);
    platformId = inject(PLATFORM_ID);

    /**
     * Logs in the user by storing the provided authentication token in the local storage.
     * This operation is only performed if the code is running in a browser environment.
     *
     * @param token - The authentication token to be stored.
     *
     * @returns {void}
     */
    logIn(token: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem("authToken", token);
        }
    }

    /**
     * Logs the user out by removing the authentication token from local storage.
     * This method should only be called in a browser environment.
     *
     * @returns {void}
     */
    logOut(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem("authToken");
        }
    }

    /**
     * Retrieves the authentication token from the local storage if the code is running in a browser environment.
     *
     * @returns {string} The authentication token if it exists in local storage, otherwise an empty string.
     */
    getLocalStorage(): string {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem("authToken");
            return token ? token : "";
        }

        return "";
    }

    /**
     * Checks if the user is logged in by verifying the presence of a value in local storage.
     *
     * @remarks
     * This method is not a secure way to check if a user is logged in. It is intended only for controlling visual elements.
     * Server-side routes should be protected to ensure security.
     *
     * @returns {boolean} Returns `true` if a value is found in local storage, otherwise `false`.
     */
    isLoggedIn(): boolean {
        // This is not a secure way to check if a user is logged in.
        // Routes are protected on the server side, this is only for visual elements.
        return this.getLocalStorage() !== "";
    }

    /**
     * Validates the provided email and password.
     *
     * @param email - The email address to validate.
     * @param password - The password to validate.
     *
     * @returns {[boolean, LoginValidation, { title: string; message: string }]} A tuple containing:
     *  - A boolean indicating whether the validation was successful.
     *  - An object representing the validation status of the email and password.
     *  - An error object containing a title and message if validation fails.
     */
    validateData(email: string, password: string): [boolean, LoginValidation, { title: string; message: string }] {
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

        const result: LoginValidation = {
            email: {
                value: email.trim(),
                valid: false,
            },
            password: {
                value: password.trim(),
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
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result["email"].value)) {
            result["email"].valid = false;
            valid = false;
            setError("Fehler", "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        }

        return [valid, result, error];
    }

    /**
     * Sends login data to the authentication API.
     *
     * @param {LoginValidation} data - The login validation data containing email and password.
     * @returns {Observable<any>} An observable that emits the server response.
     *
     * @example
     * ```typescript
     * const loginData: LoginValidation = {
     *   email: { value: 'user@example.com' },
     *   password: { value: 'password123' }
     * };
     *
     * authService.sendData(loginData).subscribe(response => {
     *   console.log(response);
     * });
     * ```
     */
    sendData(data: LoginValidation): Observable<any> {
        const request = this.http.post("/api/public/auth/login", {
            email: data["email"].value,
            password: data.password.value,
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
