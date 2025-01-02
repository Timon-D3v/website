import { Component } from "@angular/core";
import { ContactFormComponent } from "../components/contact-form/contact-form.component";

@Component({
    selector: "app-contact",
    imports: [ContactFormComponent],
    templateUrl: "./contact.component.html",
    styleUrl: "./contact.component.scss",
})
export class ContactComponent {}
