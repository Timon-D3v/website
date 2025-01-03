import { Component, signal } from "@angular/core";
import { DropdownMenuComponent } from "../dropdown-menu/dropdown-menu.component";

@Component({
    selector: "app-profile-button",
    imports: [DropdownMenuComponent],
    templateUrl: "./profile-button.component.html",
    styleUrl: "./profile-button.component.scss",
})
export class ProfileButtonComponent {
    profilePictureUrl = signal("https://picsum.photos/200");
    profileFirstName = signal("John");
    profileLastName = signal("Doe");
}
