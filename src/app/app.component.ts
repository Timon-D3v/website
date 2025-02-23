import { Component, inject, OnInit } from "@angular/core";
import { Router, RouterOutlet, NavigationEnd, NavigationStart } from "@angular/router";
import { timonjs_message } from "timonjs";
import { filter } from "rxjs";
import { NotificationsWrapperComponent } from "./components/notifications-wrapper/notifications-wrapper.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SiteTitleService } from "./services/site-title.service";
import { GsapService } from "./services/gsap.service";
import { CookieBannerComponent } from "./components/cookie-banner/cookie-banner.component";
import { Media220Component } from "./components/media-220/media-220.component";
import { AuthService } from "./services/auth.service";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, HeaderComponent, FooterComponent, NotificationsWrapperComponent, CookieBannerComponent, Media220Component],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    private router = inject(Router);

    private siteTitleService = inject(SiteTitleService);
    private gsapService = inject(GsapService);
    private authService = inject(AuthService);

    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     * This is where you should put initialization logic for the component.
     *
     * In this implementation:
     * - `timonjs_message()` is called.
     * - `gsapService` is initialized.
     * - Subscriptions to router events are set up to handle navigation start and end events.
     *
     * The `navigationEndPipe` subscription updates the site title based on the current route.
     * The `navigationStartPipe` subscription updates the login state before the route changes.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        timonjs_message();

        this.gsapService.init();

        const navigationEndPipe = this.router.events.pipe(filter((event): boolean => event instanceof NavigationEnd));
        const navigationStartPipe = this.router.events.pipe(filter((event): boolean => event instanceof NavigationStart));

        navigationEndPipe.subscribe((): void => {
            // The part below is called every time the route changes.
            this.siteTitleService.setTitleForRoute(this.router.url);
        });

        navigationStartPipe.subscribe((): void => {
            // The part below is called every time the route could change.
            this.authService.updateLoginState();
        });
    }
}
