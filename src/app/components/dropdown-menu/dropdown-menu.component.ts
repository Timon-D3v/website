import { Component, inject, PLATFORM_ID } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: "app-dropdown-menu",
    imports: [RouterLink],
    templateUrl: "./dropdown-menu.component.html",
    styleUrl: "./dropdown-menu.component.scss",
})
export class DropdownMenuComponent {
    authService = inject(AuthService);
}
