import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { CookieConsentService } from "../../services/cookie-consent.service";
import { isPlatformBrowser } from "@angular/common";
import { RouterLink } from "@angular/router";



@Component({
    selector: "app-cookie-banner",
    imports: [RouterLink],
    templateUrl: "./cookie-banner.component.html",
    styleUrl: "./cookie-banner.component.scss",
})
export class CookieBannerComponent implements OnInit {
    cookieConsentService = inject(CookieConsentService);
    platformId = inject(PLATFORM_ID);

    hidden = signal(this.cookieConsentService.hasAcceptedCookies() || this.cookieConsentService.hasRejectedCookies());

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.cookieConsentService.init();

        if (this.cookieConsentService.hasAcceptedCookies()) this.cookieConsentService.acceptCookies();
    }

    acceptCookies(): void {
        this.cookieConsentService.acceptCookies();
        this.hidden.set(true);
    }

    rejectCookies(): void {
        this.cookieConsentService.rejectCookies();
        this.hidden.set(true);
    }
}
