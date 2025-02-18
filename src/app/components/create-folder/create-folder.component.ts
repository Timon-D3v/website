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

    onSubmit() {
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

        this.fileService.createFolder(this.folderForm.value.nameControl?.trim() as string).subscribe((response: ApiResponse) => {
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

    validateForm(): { error: boolean; message: string } {
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

    createNewFolder() {
        this.isHidden.set(false);
    }

    closePopup(event: Event) {
        event?.stopPropagation();
        this.isHidden.set(true);
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
