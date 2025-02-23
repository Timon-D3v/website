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
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);

    private router = inject(Router);

    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     * Initiates the server-side logout process and handles the response.
     *
     * - If the server-side logout is successful, logs out the user client-side and shows a neutral notification.
     * - If the server-side logout fails, logs the error and shows an error notification.
     * - Navigates to the home page after attempting to log out.
     *
     * @returns {void}
     */
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
