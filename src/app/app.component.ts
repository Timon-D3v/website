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
    router = inject(Router);

    siteTitleService = inject(SiteTitleService);
    gsapService = inject(GsapService);
    authService = inject(AuthService);

    ngOnInit(): void {
        timonjs_message();

        this.gsapService.init();

        const navigationEndPipe = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));
        const navigationStartPipe = this.router.events.pipe(filter((event) => event instanceof NavigationStart));

        navigationEndPipe.subscribe(() => {
            // The part below is called every time the route changes.
            this.siteTitleService.setTitleForRoute(this.router.url);
        });

        navigationStartPipe.subscribe(() => {
            // The part below is called every time the route could change.
            this.authService.updateLoginState();
        });
    }
}
