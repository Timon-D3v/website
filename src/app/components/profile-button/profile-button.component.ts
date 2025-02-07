import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { DropdownMenuComponent } from "../dropdown-menu/dropdown-menu.component";
import { AuthService } from "../../services/auth.service";
import { isPlatformBrowser } from "@angular/common";
import gsap from "gsap";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

@Component({
    selector: "app-profile-button",
    imports: [DropdownMenuComponent],
    templateUrl: "./profile-button.component.html",
    styleUrl: "./profile-button.component.scss",
})
export class ProfileButtonComponent implements OnInit, OnDestroy {
    platformId = inject(PLATFORM_ID);

    authService = inject(AuthService);

    router = inject(Router);

    profilePictureUrl = signal(this.authService.currentUser() === null ? "" : this.authService.currentUser()?.picture);
    profileFirstName = signal(this.authService.currentUser() === null ? "" : this.authService.currentUser()?.name);
    profileLastName = signal(this.authService.currentUser() === null ? "" : this.authService.currentUser()?.familyName);

    dropDownOpen = signal(false);

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        gsap.set("#profile-dropdown-menu", {
            y: "-100vh",
            scale: 0.01,
        });

        const events = this.router.events;

        const pipe = events.pipe(filter((event) => event instanceof NavigationEnd));

        pipe.subscribe(() => {
            this.closeDropDown();
        });
    }

    ngOnDestroy(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        document.removeEventListener("click", this.closeDropDown);
    }

    toggleDropDown(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        if (this.dropDownOpen()) {
            this.closeDropDown();
        } else {
            this.openDropDown();
        }
    }

    closeDropDown(): void {
        gsap.to("#profile-dropdown-menu", {
            y: "-100vh",
            duration: 0.5,
            scale: 0.01,
            ease: "power2.inOut",
        });

        this.dropDownOpen.set(false);
    }

    openDropDown(): void {
        gsap.to("#profile-dropdown-menu", {
            y: "0vh",
            duration: 0.5,
            scale: 1,
            ease: "power2.inOut",
        });

        this.dropDownOpen.set(true);
    }
}
