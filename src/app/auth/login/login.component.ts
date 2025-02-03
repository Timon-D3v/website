import { Component, inject, signal } from "@angular/core";
import { PrimaryButtonComponent } from "../../components/primary-button/primary-button.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../services/notification.service";
import { AuthService } from "../../services/auth.service";
import { getElm } from "timonjs";
import { Router } from "@angular/router";

@Component({
    selector: "app-login",
    imports: [PrimaryButtonComponent, ReactiveFormsModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss",
})
export class LoginComponent {
    disabledButton = signal(false);
    submitButtonText = signal("Einloggen");

    loginForm = new FormGroup({
        emailControl: new FormControl(""),
        passwordControl: new FormControl(""),
    });

    authService = inject(AuthService);
    notificationService = inject(NotificationService);

    router = inject(Router);

    /**
     * Handles the form submission for the login component.
     *
     * This method validates the login form data, updates the UI based on validation results,
     * sends the login data to the authentication service, and handles the response.
     *
     * @returns {void}
     */
    onSubmit(): void {
        const [valid, data, error] = this.authService.validateData(this.loginForm.value.emailControl ?? "", this.loginForm.value.passwordControl ?? "");

        getElm("email").removeClass("ng-valid", "ng-invalid");
        data["email"].valid ? getElm("email").addClass("ng-valid") : getElm("email").addClass("ng-invalid");
        if (!valid) return this.notificationService.error(error.title, error.message);

        const request = this.authService.sendData(data);

        this.disabledButton.set(true);
        this.submitButtonText.set("Wird überprüft...");

        request.subscribe((response: any) => {
            if (response?.error) {
                this.notificationService.error("Fehler", response?.message);
                this.disabledButton.set(false);
                this.submitButtonText.set("Einloggen");
            } else {
                this.notificationService.success("Erfolg", "Erfolgreich eingeloggt.");
                this.authService.logIn(response.token);
                this.authService.setUser(response.user);
                this.router.navigate(["/admin"]);
            }
        });
    }
}
