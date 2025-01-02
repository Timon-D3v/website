import { Component, OnInit } from "@angular/core";
import { Router, RouterOutlet, NavigationEnd } from "@angular/router";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { timonjs_message } from "timonjs";
import { SiteTitleService } from "./services/site-title.service";
import { filter } from "rxjs";
import { NotificationsWrapperComponent } from "./components/notifications-wrapper/notifications-wrapper.component";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, HeaderComponent, FooterComponent, NotificationsWrapperComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    constructor(
        private router: Router,
        private siteTitleService: SiteTitleService,
    ) {}

    ngOnInit(): void {
        timonjs_message();

        const events = this.router.events;

        const pipe = events.pipe(filter((event) => event instanceof NavigationEnd));

        pipe.subscribe(() => {
            this.siteTitleService.setTitleForRoute(this.router.url);
        });
    }
}
