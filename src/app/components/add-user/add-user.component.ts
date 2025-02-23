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

    private userService = inject(UserService);
    private notificationService = inject(NotificationService);

    /**
     * Validates the data in the addUserForm.
     *
     * @returns {{ valid: boolean; message: string }} An object containing a boolean `valid` indicating whether the data is valid,
     * and a `message` string with an error message if the data is invalid.
     *
     * The validation checks the following fields:
     * - `familyNameControl`: Must be a non-empty string.
     * - `nameControl`: Must be a non-empty string.
     * - `emailControl`: Must be a non-empty string.
     *
     * If any of these fields are invalid, `valid` will be set to `false` and `message` will contain
     * an appropriate error message.
     */
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

    /**
     * Handles the form submission for adding a new user.
     *
     * This method performs the following steps:
     * 1. Disables the submit button and updates its text to indicate the submission is in progress.
     * 2. Validates the form data.
     * 3. If validation fails, displays an error notification, re-enables the submit button, and resets its text.
     * 4. If validation succeeds, sends a request to add the user.
     * 5. Handles the response from the add user request:
     *    - If there is an error, displays an error notification.
     *    - If the addition is successful, displays a success notification and resets the form.
     *
     * @returns {void}
     */
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
