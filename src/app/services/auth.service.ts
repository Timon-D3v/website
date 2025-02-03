import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { LoginValidation, PublicUser } from "../../@types/auth.type";
import publicConfig from "../../public.config";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    http = inject(HttpClient);
    platformId = inject(PLATFORM_ID);

    currentUser: WritableSignal<null | PublicUser> = signal(null);
    isAdmin = signal(false);

    /**
     * Logs in the user by storing the provided authentication token in the local storage.
     * This operation is only performed if the code is running in a browser environment.
     *
     * @param {string} token - The authentication token to be stored.
     *
     * @returns {void}
     */
    logIn(token: string): void {
        if (isPlatformBrowser(this.platformId)) {
            window.localStorage.setItem("authToken", token);
        }

        if (this.currentUser() === null) return;

        this.isAdmin.set(this.currentUser()?.email === publicConfig.CONTACT_EMAIL);
    }

    /**
     * Logs the user out by removing the authentication token from local storage.
     * This method should only be called in a browser environment.
     *
     * @returns {void}
     */
    logOut(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.localStorage.removeItem("authToken");
        }
    }

    /**
     * Retrieves the authentication token from the local storage if the code is running in a browser environment.
     *
     * @returns {string} The authentication token if it exists in local storage, otherwise an empty string.
     */
    getLocalStorage(): string {
        if (isPlatformBrowser(this.platformId)) {
            const token = window.localStorage.getItem("authToken");
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
         * @param {string} title - The title to set if the current error title is empty.
         * @param {string} message - The message to set if the current error message is empty.
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
     *
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

    /**
     * Sends a logout request to the authentication API.
     *
     * @returns {Observable<any>} An observable that emits the server response.
     *
     * @example
     * ```typescript
     * authService.logOutServerSide().subscribe(response => {
     *   console.log(response);
     * });
     * ```
     */
    logOutServerSide(): Observable<any> {
        const request = this.http.post("/api/public/auth/logout", {
            token: this.getLocalStorage(),
        });

        request.pipe(
            catchError((error) => {
                console.error(error);
                return error;
            }),
        );

        this.currentUser.set(null);
        this.isAdmin.set(false);

        return request;
    }

    /**
     * Updates the login state of the user by making an HTTP GET request to check if the user is logged in.
     * If the user is logged in, it logs the user in with the provided token.
     * If the user is not logged in, it logs the user out.
     *
     * The method handles any errors that occur during the HTTP request by logging them to the console.
     *
     * @returns {void}
     */
    updateLoginState(): void {
        const request = this.http.post("/api/public/auth/isLoggedIn", {
            token: this.getLocalStorage(),
        });

        request.pipe(
            catchError((error) => {
                console.error(error);
                return error;
            }),
        );

        request.subscribe((response: any) => {
            if (response.valid) {
                this.logIn(response.token);

                const rawUser = window.localStorage.getItem("user");

                if (rawUser) {
                    this.setUser(JSON.parse(rawUser));
                }
            } else {
                this.logOut();
            }
        });
    }

    /**
     * Sets the current user and updates the local storage and admin status.
     *
     * @param {PublicUser} user - The user object to set as the current user.
     *
     * @returns {void}
     */
    setUser(user: PublicUser): void {
        this.currentUser.set(user);
        window.localStorage.setItem("user", JSON.stringify(user));
        this.isAdmin.set(user.email === publicConfig.CONTACT_EMAIL);
    }
}
