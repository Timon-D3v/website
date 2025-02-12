import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../services/notification.service";
import { FileInputComponent } from "../file-input/file-input.component";
import { toBase64 } from "timonjs";
import { ProjectsService } from "../../services/projects.service";
import { ApiResponse } from "../../../@types/apiResponse.type";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-add-projects",
    imports: [PrimaryButtonComponent, ReactiveFormsModule, FileInputComponent],
    templateUrl: "./add-projects.component.html",
    styleUrl: "./add-projects.component.scss",
})
export class AddProjectsComponent {
    disabledButton = signal(false);
    submitButtonText = signal("Hinzufügen");
    picture = signal("/svg/cloud.svg");
    pictureFileName = signal("");
    imageIsValid = signal<number | boolean>(2);
    portraitPicture = signal("/svg/cloud.svg");
    portraitPictureFileName = signal("");
    portraitImageIsValid = signal<number | boolean>(2);

    addProjectForm = new FormGroup({
        titleControl: new FormControl(""),
        descriptionControl: new FormControl(""),
        urlControl: new FormControl(""),
        imageControl: new FormControl<File | null>(null),
        portraitImageControl: new FormControl<File | null>(null),
    });

    notificationService = inject(NotificationService);
    projectsService = inject(ProjectsService);
    platformId = inject(PLATFORM_ID);

    async onFileSelected(event: Event, controlName: "imageControl" | "portraitImageControl"): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) return;

        const input = event.target as HTMLInputElement;

        if (input.files && input.files.length > 0) {
            this.addProjectForm.patchValue({
                [controlName]: input.files[0], // Store the actual File object
            });

            this.addProjectForm.get(controlName)?.updateValueAndValidity();

            if (controlName === "imageControl") {
                this.imageIsValid.set(true);

                this.pictureFileName.set(input.files[0].name);

                const base64 = await toBase64(input.files[0]);
                this.picture.set(base64);
            } else {
                this.portraitImageIsValid.set(true);

                this.portraitPictureFileName.set(input.files[0].name);

                const base64 = await toBase64(input.files[0]);
                this.portraitPicture.set(base64);
            }
        } else {
            this.addProjectForm.patchValue({
                [controlName]: null,
            });

            this.addProjectForm.get(controlName)?.updateValueAndValidity();

            if (controlName === "imageControl") {
                this.imageIsValid.set(false);
                this.picture.set("/svg/cloud.svg");
                this.pictureFileName.set("");
            } else {
                this.portraitImageIsValid.set(false);
                this.portraitPicture.set("/svg/cloud.svg");
                this.portraitPictureFileName.set("");
            }
        }
    }

    validateForm(): { valid: boolean; message: string } {
        const response = {
            valid: true,
            message: "",
        };

        if (typeof this.addProjectForm.value.portraitImageControl === "undefined" || this.addProjectForm.value.portraitImageControl === null || !(this.addProjectForm.value.portraitImageControl instanceof File)) {
            response.valid = false;
            response.message = "Bitte wähle ein Hochformat-Bild aus.";
        }

        if (typeof this.addProjectForm.value.imageControl === "undefined" || this.addProjectForm.value.imageControl === null || !(this.addProjectForm.value.imageControl instanceof File)) {
            response.valid = false;
            response.message = "Bitte wähle ein Querformat-Bild aus.";
        }

        if (typeof this.addProjectForm.value.descriptionControl !== "string" || this.addProjectForm.value.descriptionControl.trim() === "") {
            response.valid = false;
            response.message = "Bitte gib eine Beschreibung ein.";
        }

        if (typeof this.addProjectForm.value.urlControl !== "string" || this.addProjectForm.value.urlControl.trim() === "") {
            response.valid = false;
            response.message = "Bitte gib einen Link zur Webseite an.";
        }

        if (typeof this.addProjectForm.value.titleControl !== "string" || this.addProjectForm.value.titleControl.trim() === "") {
            response.valid = false;
            response.message = "Bitte gib einen Titel ein.";
        }

        return response;
    }

    onSubmit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.disabledButton.set(true);
        this.submitButtonText.set("Wird hinzugefügt...");

        const validationResult = this.validateForm();

        if (!validationResult.valid) {
            this.notificationService.error("Fehler beim Ausfüllen:", validationResult.message);
            this.disabledButton.set(false);
            this.submitButtonText.set("Hinzufügen");
            return;
        }

        const formData = new FormData();

        formData.append("title", this.addProjectForm.value.titleControl || "");
        formData.append("description", this.addProjectForm.value.descriptionControl || "");
        formData.append("url", this.addProjectForm.value.urlControl || "");

        if (this.addProjectForm.value.imageControl) {
            formData.append("image", this.addProjectForm.value.imageControl);
        }

        if (this.addProjectForm.value.portraitImageControl) {
            formData.append("portraitImage", this.addProjectForm.value.portraitImageControl);
        }

        const request = this.projectsService.addProject(formData);

        request.subscribe((response: ApiResponse) => {
            this.disabledButton.set(false);
            this.submitButtonText.set("Hinzufügen");

            if (response.error) return this.notificationService.error("Fehler: ", response.message);

            this.notificationService.success("Projekt hinzugefügt:", response.message);
            this.addProjectForm.reset();
        });
    }
}
