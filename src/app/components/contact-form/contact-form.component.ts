import { Component, forwardRef, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { ContactService } from "../../services/contact.service";
import { NotificationService } from "../../services/notification.service";
import { getElm } from "timonjs";
import publicConfig from "../../../public.config";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-contact-form",
    imports: [PrimaryButtonComponent, ReactiveFormsModule],
    templateUrl: "./contact-form.component.html",
    styleUrl: "./contact-form.component.scss",
    providers: [
        {
            provide: "NG_VALUE_ACCESSOR",
            useExisting: forwardRef(() => ContactFormComponent),
            multi: true,
        },
    ],
})
export class ContactFormComponent {
    contactForm = new FormGroup({
        nameControl: new FormControl(""),
        familyNameControl: new FormControl(""),
        emailControl: new FormControl(""),
        messageControl: new FormControl(""),
    });

    email = publicConfig.EMAIL;

    submitButtonText = signal("Abschicken");
    disabledButton = signal(false);

    private contactService = inject(ContactService);
    private notificationService = inject(NotificationService);
    private platformId = inject(PLATFORM_ID);

    /**
     * Handles the form submission event.
     *
     * This method validates the form data using the `contactService.validateData` method.
     * If the data is valid, it sends the data using the `contactService.sendData` method.
     *
     * The method updates the UI to reflect the submission status:
     * - Adds validation classes to the email input element.
     * - Disables the submit button and changes its text to "Wird gesendet..." while the request is in progress.
     *
     * Upon receiving a response:
     * - If there is an error, it displays an error notification and re-enables the submit button.
     * - If the submission is successful, it displays a success notification and updates the submit button text to "Verschickt".
     *
     * @returns {void}
     */
    onSubmit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const [valid, data, error] = this.contactService.validateData(this.contactForm.value.nameControl ?? "", this.contactForm.value.familyNameControl ?? "", this.contactForm.value.emailControl ?? "", this.contactForm.value.messageControl ?? "");

        getElm("email").removeClass("ng-valid", "ng-invalid");
        data.email.valid ? getElm("email").addClass("ng-valid") : getElm("email").addClass("ng-invalid");
        if (!valid) return this.notificationService.error(error.title, error.message);

        const request = this.contactService.sendData(data);

        this.disabledButton.set(true);
        this.submitButtonText.set("Wird gesendet...");

        request.subscribe((response: any) => {
            if (response?.error) {
                this.notificationService.error("Fehler", "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
                this.disabledButton.set(false);
                this.submitButtonText.set("Abschicken");
            } else {
                this.notificationService.success("Erfolg", "Ihre Nachricht wurde erfolgreich versendet.");
                this.submitButtonText.set("Verschickt");
            }
        });
    }
}
