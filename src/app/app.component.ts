import { Component, inject, OnInit } from "@angular/core";
import { Router, RouterOutlet, NavigationEnd } from "@angular/router";
import { timonjs_message } from "timonjs";
import { filter } from "rxjs";
import { NotificationsWrapperComponent } from "./components/notifications-wrapper/notifications-wrapper.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SiteTitleService } from "./services/site-title.service";
import { GsapService } from "./services/gsap.service";
import { CookieBannerComponent } from "./components/cookie-banner/cookie-banner.component";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, HeaderComponent, FooterComponent, NotificationsWrapperComponent, CookieBannerComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    router = inject(Router);
    siteTitleService = inject(SiteTitleService);
    gsapService = inject(GsapService);

    ngOnInit(): void {
        timonjs_message();

        this.gsapService.init();

        const events = this.router.events;

        const pipe = events.pipe(filter((event) => event instanceof NavigationEnd));

        pipe.subscribe(() => {
            this.siteTitleService.setTitleForRoute(this.router.url);
        });
    }
}
