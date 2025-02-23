import { Component, inject, signal } from "@angular/core";
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../services/notification.service";
import { FileService } from "../../services/file.service";
import { ApiResponse } from "../../../@types/apiResponse.type";

@Component({
    selector: "app-create-folder",
    imports: [PrimaryButtonComponent, ReactiveFormsModule],
    templateUrl: "./create-folder.component.html",
    styleUrl: "./create-folder.component.scss",
})
export class CreateFolderComponent {
    isHidden = signal(true);
    buttonDisabled = signal(false);
    buttonText = signal("Erstellen");
    inputClass = signal("");

    folderForm = new FormGroup({
        nameControl: new FormControl(""),
    });

    private notificationService = inject(NotificationService);
    private fileService = inject(FileService);

    /**
     * Handles the form submission for creating a new folder.
     *
     * This method performs the following steps:
     * 1. Disables the submit button and updates its text to indicate the creation process.
     * 2. Validates the form input.
     * 3. If validation fails, displays an error notification, re-enables the button, and updates the input class.
     * 4. If validation succeeds, calls the file service to create the folder.
     * 5. Handles the response from the file service:
     *    - If there's an error, displays an error notification, re-enables the button, and updates the input class.
     *    - If successful, displays a success notification, updates the file system, hides the form, re-enables the button, resets the input class, and resets the form.
     *
     * @returns {void}
     */
    onSubmit(): void {
        this.buttonDisabled.set(true);
        this.buttonText.set("Erstellt...");

        const validationResult = this.validateForm();

        if (validationResult.error) {
            this.notificationService.error("Fehler beim Ausfüllen:", validationResult.message);
            this.buttonDisabled.set(false);
            this.buttonText.set("Erstellen");
            this.inputClass.set("ng-invalid");
            return;
        }

        this.fileService.createFolder(this.folderForm.value.nameControl?.trim() as string).subscribe((response: ApiResponse): void => {
            if (response.error) {
                this.notificationService.error("Fehler beim Erstellen des Ordners:", response.message);
                this.buttonDisabled.set(false);
                this.buttonText.set("Erstellen");
                this.inputClass.set("ng-invalid");
                return;
            }

            this.notificationService.success("Ordner erstellt:", "Der Ordner wurde erfolgreich erstellt.");
            this.fileService.updateFileSystem();
            this.isHidden.set(true);
            this.buttonDisabled.set(false);
            this.buttonText.set("Erstellen");
            this.inputClass.set("");
            this.folderForm.reset();
        });
    }

    /**
     * Validates the form input for creating a folder.
     *
     * @returns {ApiResponse} An object containing an error flag and a message.
     *          If the input is invalid, `error` will be `true` and `message` will contain the error message.
     *          If the input is valid, `error` will be `false` and `message` will be an empty string.
     *
     * The validation checks the following:
     * - The `nameControl` value must be a non-empty string.
     * - The `nameControl` value must not be "root".
     * - The `nameControl` value must not contain any of the following characters: / \ . : * ? " ' < > |
     */
    validateForm(): ApiResponse {
        if (typeof this.folderForm.value.nameControl !== "string" || this.folderForm.value.nameControl?.trim() === "") {
            return {
                error: true,
                message: "Bitte gib einen Namen ein.",
            };
        }

        if (this.folderForm.value.nameControl === "root" || /[\/\\\.\:\*\?\"\'\<\>\|]/gm.test(this.folderForm.value.nameControl)) {
            return {
                error: true,
                message: "Der Name darf nicht 'root' sein und keine der folgenden Zeichen enthalten: / \\ . : * ? \" ' < > |",
            };
        }

        return {
            error: false,
            message: "",
        };
    }

    /**
     * Creates a new folder by setting the `isHidden` property to `false`.
     * This method is typically used to reveal a folder creation UI component.
     *
     * @returns {void}
     */
    createNewFolder(): void {
        this.isHidden.set(false);
    }

    /**
     * Closes the popup by stopping the event propagation and setting the `isHidden` property to true.
     *
     * @param {Event} event - The event that triggered the close action.
     * @returns {void}
     */
    closePopup(event: Event): void {
        event?.stopPropagation();
        this.isHidden.set(true);
    }

    /**
     * Stops the propagation of the given event.
     *
     * @param {Event} event - The event whose propagation should be stopped.
     * @returns {void}
     */
    stopPropagation(event: Event): void {
        event.stopPropagation();
    }
}
