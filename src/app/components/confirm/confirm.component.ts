import { Component, input, output } from "@angular/core";
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { SecondaryButtonComponent } from "../secondary-button/secondary-button.component";

@Component({
    selector: "app-confirm",
    imports: [PrimaryButtonComponent, SecondaryButtonComponent],
    templateUrl: "./confirm.component.html",
    styleUrl: "./confirm.component.scss",
})
export class ConfirmComponent {
    visible = input(false);

    title = input("");
    text = input("");

    confirmText = input("Bestätigen");
    cancelText = input("Abbrechen");
    confirmTitle = input("Bestätigen");
    cancelTitle = input("Abbrechen");

    confirmDisabled = input(false);

    result = output<boolean>();

    confirm(): void {
        this.result.emit(true);
        console.log("confirm");
    }

    cancel(): void {
        this.result.emit(false);
        console.log("cancel");
    }

    stopPropagation(event: Event): void {
        event.stopPropagation();
    }
}
