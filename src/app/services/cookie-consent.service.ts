import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class CookieConsentService {
    platformId = inject(PLATFORM_ID);

    consentEvent = new Event("cookie_consent_updated");

    acceptCookies() {
        if (!isPlatformBrowser(this.platformId)) return;

        localStorage.setItem("cookie_consent", "true");
        localStorage.setItem(
            "cookie_consent_mode",
            JSON.stringify({
                ad_storage: "granted",
                analytics_storage: "granted",
                functionality_storage: "granted",
                personalization_storage: "granted",
                security_storage: "granted",
            }),
        );
        document.dispatchEvent(this.consentEvent);
    }

    rejectCookies() {
        if (!isPlatformBrowser(this.platformId)) return;

        localStorage.setItem("cookie_consent", "false");
        localStorage.setItem(
            "cookie_consent_mode",
            JSON.stringify({
                ad_storage: "denied",
                analytics_storage: "denied",
                personalization_storage: "denied",
                functionality_storage: "granted",
                security_storage: "granted",
            }),
        );
        document.dispatchEvent(this.consentEvent);
    }

    hasAcceptedCookies(): boolean {
        if (!isPlatformBrowser(this.platformId)) return false;

        return localStorage.getItem("cookie_consent") === "true";
    }

    hasRejectedCookies(): boolean {
        if (!isPlatformBrowser(this.platformId)) return false;

        return localStorage.getItem("cookie_consent") === "false";
    }

    init() {
        if (!isPlatformBrowser(this.platformId)) return;

        if (this.hasAcceptedCookies()) return;

        localStorage.setItem(
            "cookie_consent_mode",
            JSON.stringify({
                ad_storage: "denied",
                analytics_storage: "denied",
                personalization_storage: "denied",
                functionality_storage: "granted",
                security_storage: "granted",
            }),
        );
    }
}
