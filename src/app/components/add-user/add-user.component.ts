import { Component, inject, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { NotificationService } from "../../services/notification.service";
import { UserService } from "../../services/user.service";
import { response } from "express";
import { ApiResponse } from "../../../@types/apiResponse.type";

@Component({
    selector: "app-add-user",
    imports: [ReactiveFormsModule, PrimaryButtonComponent],
    templateUrl: "./add-user.component.html",
    styleUrl: "./add-user.component.scss",
})
export class AddUserComponent {
    disabledButton = signal(false);
    submitButtonText = signal("Hinzufügen");

    addUserForm = new FormGroup({
        emailControl: new FormControl(""),
        nameControl: new FormControl(""),
        familyNameControl: new FormControl(""),
    });

    userService = inject(UserService);
    notificationService = inject(NotificationService);

    validateData(): { valid: boolean; message: string } {
        const response = {
            valid: true,
            message: "",
        };

        if (typeof this.addUserForm.value.familyNameControl !== "string" || this.addUserForm.value.familyNameControl.trim() === "") {
            response.valid = false;
            response.message = "Bitte gib eine Beschreibung ein.";
        }

        if (typeof this.addUserForm.value.nameControl !== "string" || this.addUserForm.value.nameControl.trim() === "") {
            response.valid = false;
            response.message = "Bitte gib einen Link zur Webseite an.";
        }

        if (typeof this.addUserForm.value.emailControl !== "string" || this.addUserForm.value.emailControl.trim() === "") {
            response.valid = false;
            response.message = "Bitte gib einen Titel ein.";
        }

        return response;
    }

    onSubmit(): void {
        this.disabledButton.set(true);
        this.submitButtonText.set("Wird hinzugefügt...");

        const validationResult = this.validateData();

        if (!validationResult.valid) {
            this.notificationService.error("Fehler beim Ausfüllen:", validationResult.message);
            this.disabledButton.set(false);
            this.submitButtonText.set("Hinzufügen");
            return;
        }

        const request = this.userService.addUser(this.addUserForm.value.emailControl as string, this.addUserForm.value.nameControl as string, this.addUserForm.value.familyNameControl as string);

        request.subscribe((response: ApiResponse): void => {
            this.disabledButton.set(false);
            this.submitButtonText.set("Hinzufügen");

            if (response.error) {
                this.notificationService.error("Fehler beim Hinzufügen:", response.message);
                return;
            }

            this.notificationService.success("Erfolgreich hinzugefügt:", response.message);
            this.addUserForm.reset();
        });
    }
}
