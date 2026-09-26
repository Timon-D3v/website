import { Component, forwardRef, inject, PLATFORM_ID, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { ContactService } from "../../services/contact.service";
import { NotificationService } from "../../services/notification.service";
import { getElm } from "timonjs";
import publicConfig from "../../../public.config";
import { isPlatformBrowser } from "@angular/common";
import { ApiResponse } from "../../../@types/apiResponse.type";

@Component({
    selector: "app-contact-form",
    imports: [PrimaryButtonComponent, ReactiveFormsModule],
    templateUrl: "./contact-form.component.html",
    styleUrl: "./contact-form.component.scss",
    providers: [],
})
export class ContactFormComponent {
    contactForm = new FormGroup({
        nameControl: new FormControl(""),
        familyNameControl: new FormControl(""),
        emailControl: new FormControl(""),
        messageControl: new FormControl(""),
    });

    contactVerificationForm = new FormGroup({
        tokenControl: new FormControl(""),
        verificationCodeControl: new FormControl(""),
    });

    email = publicConfig.EMAIL;

    submitButtonText = signal("Abschicken");
    disabledButton = signal(false);

    verificationCodeSent = signal(false);

    emailClass = signal<null | "ng-valid" | "ng-invalid">(null);

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

        this.emailClass.set(data.email.valid ? "ng-valid" : "ng-invalid");

        if (!valid) {
            return this.notificationService.error(error.title, error.message);
        }

        const request = this.contactService.sendData(data);

        this.disabledButton.set(true);
        this.submitButtonText.set("Wird gesendet...");

        request.subscribe((response: ApiResponse) => {
            if (response?.error) {
                this.notificationService.error("Fehler", "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
                this.disabledButton.set(false);
                this.submitButtonText.set("Abschicken");
            } else {
                this.notificationService.info("Bestätigung erforderlich:", "Um Spam zu vermeiden erfordert die Anfrage eine Bestätigung deiner E-Mail-Adresse. Bitte gib den Code aus deinem Postfach ein, um deine Anfrage zu bestätigen.");

                this.contactForm.reset();

                this.verificationCodeSent.set(true);
                this.disabledButton.set(false);
                this.submitButtonText.set("Bestätigen");

                console.info("Verification token:", response.message);
                this.contactVerificationForm.patchValue({
                    tokenControl: response.message,
                });
            }
        });
    }

    onVerificationSubmit(event: Event): void {
        event.preventDefault();

        this.disabledButton.set(true);
        this.submitButtonText.set("Bestätigen...");

        const token = this.contactVerificationForm.value.tokenControl;
        const verificationCode = this.contactVerificationForm.value.verificationCodeControl;

        if (typeof token !== "string" || !/^[a-z0-9]{64}$/.test(token.toLowerCase())) {
            this.notificationService.error("Applikationsfehler:", "Es wurde kein gültiger Token übermittelt. Bitte lade die Seite neu und versuche es noch einmal.");

            this.disabledButton.set(false);
            this.submitButtonText.set("Bestätigen");

            return;
        }

        if (typeof verificationCode !== "string" || !/^[a-z0-9]{10}$/.test(verificationCode.toLowerCase())) {
            this.notificationService.error("Eingabefehler:", "Bitte gib einen gültigen Bestätigungscode ein.");

            this.disabledButton.set(false);
            this.submitButtonText.set("Bestätigen");

            return;
        }

        const request = this.contactService.confirmRequest(token, verificationCode);

        request.subscribe({
            next: (response: ApiResponse) => {
                if (response.error) {
                    this.notificationService.error("Fehler:", "Deine Anfrage konnte nicht bestätigt werden, da der Bestätigungscode ungültig oder abgelaufen ist.");

                    this.disabledButton.set(false);
                    this.submitButtonText.set("Bestätigen");

                    return;
                }

                this.notificationService.success("Versendet!", "Deine E-Mail-Adresse wurde erfolgreich bestätigt und deine Nachricht wurde versendet. Wir werden uns so schnell wie möglich bei dir melden.");

                this.verificationCodeSent.set(false);

                this.contactVerificationForm.reset();

                this.disabledButton.set(false);
                this.submitButtonText.set("Absenden");
            },
            error: (error: unknown) => {
                console.error("Error while confirming contact request verification token:", error);
                this.notificationService.error("Fehler", "Beim Bestätigen des Bestätigungscodes ist ein Fehler aufgetreten. Bitte versuche es erneut.");

                this.disabledButton.set(false);
                this.submitButtonText.set("Bestätigen");
            },
        });
    }
}
