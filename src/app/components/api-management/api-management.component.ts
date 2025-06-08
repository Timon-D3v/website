import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { ApiManagementService } from "../../services/api-management.service";
import { NotificationService } from "../../services/notification.service";
import { isPlatformBrowser } from "@angular/common";
import { ApiResponse } from "../../../@types/apiResponse.type";

@Component({
    selector: "app-api-management",
    imports: [ReactiveFormsModule, PrimaryButtonComponent],
    templateUrl: "./api-management.component.html",
    styleUrl: "./api-management.component.scss",
})
export class ApiManagementComponent {
    disabledButton = signal(false);
    submitButtonText = signal("Generieren");

    generateApiKeyForm = new FormGroup({
        organizationNameControl: new FormControl(""),
    });

    private notificationService = inject(NotificationService);
    private apiManagementService = inject(ApiManagementService);
    private platformId = inject(PLATFORM_ID);

    validateForm(): { valid: boolean; message: string } {
        const response = {
            valid: true,
            message: "",
        };

        if (typeof this.generateApiKeyForm.value.organizationNameControl !== "string" || this.generateApiKeyForm.value.organizationNameControl.trim() === "") {
            response.valid = false;
            response.message = "Bitte gib einen Namen ein.";
        }

        return response;
    }

    onSubmit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.disabledButton.set(true);
        this.submitButtonText.set("Wird generiert...");

        const validationResult = this.validateForm();

        if (!validationResult.valid) {
            this.notificationService.error("Fehler beim Ausfüllen:", validationResult.message);
            this.disabledButton.set(false);
            this.submitButtonText.set("Generieren");
            return;
        }

        const request = this.apiManagementService.generateApiKey(this.generateApiKeyForm.value.organizationNameControl as string);

        request.subscribe((response: ApiResponse) => {
            this.disabledButton.set(false);
            this.submitButtonText.set("Hinzufügen");

            if (response.error) return this.notificationService.error("Fehler: ", response.message);

            window.navigator.clipboard.writeText(response.message);

            this.notificationService.success("Erfolgreich generiert und in die Zwischenablage kopiert:", response.message);
            this.generateApiKeyForm.reset();
        });
    }
}
