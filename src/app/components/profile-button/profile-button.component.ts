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
    private platformId = inject(PLATFORM_ID);

    private authService = inject(AuthService);

    private router = inject(Router);

    profilePictureUrl = signal(this.authService.currentUser() === null ? "" : this.authService.currentUser()?.picture);
    profileFirstName = signal(this.authService.currentUser() === null ? "" : this.authService.currentUser()?.name);
    profileLastName = signal(this.authService.currentUser() === null ? "" : this.authService.currentUser()?.familyName);

    dropDownOpen = signal(false);

    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     * Initializes the profile dropdown menu animation and sets up a subscription to close the dropdown
     * on navigation end events.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        gsap.set("#profile-dropdown-menu", {
            y: "-100vh",
            scale: 0.01,
        });

        const events = this.router.events;

        const pipe = events.pipe(filter((event): boolean => event instanceof NavigationEnd));

        pipe.subscribe((): void => {
            this.closeDropDown();
        });
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     *
     * This method removes the 'click' event listener from the document
     * to prevent memory leaks. It first checks if the code is running
     * in a browser environment using `isPlatformBrowser`.
     *
     * @returns {void}
     */
    ngOnDestroy(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        document.removeEventListener("click", this.closeDropDown);
    }

    /**
     * Toggles the state of the dropdown menu.
     *
     * If the dropdown menu is currently open, it will be closed.
     * If the dropdown menu is currently closed, it will be opened.
     *
     * This method only executes if the code is running in a browser environment.
     * It checks the platform using `isPlatformBrowser`.
     *
     * @returns {void}
     */
    toggleDropDown(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        if (this.dropDownOpen()) {
            this.closeDropDown();
        } else {
            this.openDropDown();
        }
    }

    /**
     * Closes the profile dropdown menu with an animation.
     *
     * This method uses GSAP to animate the dropdown menu out of view by moving it
     * upwards off the screen, scaling it down, and applying an easing effect.
     *
     * After the animation, it sets the `dropDownOpen` state to `false`.
     *
     * @returns {void}
     */
    closeDropDown(): void {
        gsap.to("#profile-dropdown-menu", {
            y: "-100vh",
            duration: 0.5,
            scale: 0.01,
            ease: "power2.inOut",
        });

        this.dropDownOpen.set(false);
    }

    /**
     * Opens the profile dropdown menu with an animation.
     *
     * This method uses the GSAP library to animate the dropdown menu into view.
     * The animation moves the menu vertically into position, scales it to its
     * full size, and applies an easing effect for a smooth transition.
     *
     * Once the animation is complete, the `dropDownOpen` state is set to `true`.
     *
     * @returns {void}
     */
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
