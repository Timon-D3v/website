import { Component, inject, OnInit } from "@angular/core";
import { LoadingComponent } from "../../components/loading/loading.component";
import { AuthService } from "../../services/auth.service";
import { NotificationService } from "../../services/notification.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-logout",
    imports: [LoadingComponent],
    templateUrl: "./logout.component.html",
    styleUrl: "./logout.component.scss",
})
export class LogoutComponent implements OnInit {
    authService = inject(AuthService);
    notificationService = inject(NotificationService);

    router = inject(Router);

    ngOnInit(): void {
        const request = this.authService.logOutServerSide();

        request.subscribe((response: any) => {
            if (response?.valid) {
                this.authService.logOut();
                this.notificationService.neutral("Ausgeloggt", "Sie wurden erfolgreich ausgeloggt.");
            } else {
                console.error(response);
                this.notificationService.error("Fehler", "Beim Ausloggen ist ein Fehler passiert. Bitte versuchen Sie es später erneut.");
            }
            this.router.navigate(["/"]);
        });
    }
}
