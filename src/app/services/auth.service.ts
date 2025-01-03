import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor() {}

    platformId = inject(PLATFORM_ID);

    getLocalStorage(): string {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem("authToken");
            return token ? token : "";
        }

        return "";
    }

    isLoggedIn(): boolean {
        // This is not a secure way to check if a user is logged in.
        // Routes are protected on the server side, this is only for visual elements.
        return this.getLocalStorage() !== "";
    }
}
