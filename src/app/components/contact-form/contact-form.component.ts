import { Component, forwardRef, inject, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { ContactService } from "../../services/contact.service";
import { NotificationService } from "../../services/notification.service";
import { getElm } from "timonjs";
import publicConfig from "../../../public.config";

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

    contactService = inject(ContactService);

    notificationService = inject(NotificationService);

    onSubmit() {
        const [valid, data, error] = this.contactService.validateData(this.contactForm.value.nameControl ?? "", this.contactForm.value.familyNameControl ?? "", this.contactForm.value.emailControl ?? "", this.contactForm.value.messageControl ?? "");

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
