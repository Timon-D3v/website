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

        console.warn("Local storage is not available");
        return "";
    }

    isLoggedIn(): boolean {
        if (this.getLocalStorage() !== "") {
            return true;
        } else {
            return false;
        }
    }
}
