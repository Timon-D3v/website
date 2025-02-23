import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { LoginButtonComponent } from "../login-button/login-button.component";
import { HomeCounterService } from "../../services/home-counter.service";
import { catchError } from "rxjs";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ProfileButtonComponent } from "../profile-button/profile-button.component";
import { isPlatformBrowser } from "@angular/common";
import { ApiResponse } from "../../../@types/apiResponse.type";

@Component({
    selector: "app-header",
    imports: [PrimaryButtonComponent, LoginButtonComponent, RouterLink, ProfileButtonComponent],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
})
export class HeaderComponent implements OnInit {
    homeClicked = signal(0);

    private homeCountService = inject(HomeCounterService);
    authService = inject(AuthService);
    private platformId = inject(PLATFORM_ID);

    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     * This is called once the component is initialized.
     *
     * In this implementation, it calls the `getHomeCount` method to retrieve the home count data.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.getHomeCount();
    }

    /**
     * Fetches the current home count from the homeCountService and updates the homeClicked state.
     *
     * This method makes a request to the homeCountService to get the current count of homes.
     * If an error occurs during the request, it logs the error to the console.
     * If the request is successful but the response contains an error, it logs the error message to the console.
     * Otherwise, it updates the homeClicked state with the retrieved count.
     *
     * @returns {void}
     */
    getHomeCount(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const request = this.homeCountService.getCurrentCount();

        request.pipe(
            catchError((error) => {
                console.error(error);
                return error;
            }),
        );

        request.subscribe((data: { count: number; message: string; error: boolean }): void => {
            if (data.error) return console.error(data.message);

            this.homeClicked.set(data.count);
        });
    }

    /**
     * Increases the home counter by making a request to the homeCountService.
     *
     * This method sends a request to increment the home counter and handles the response.
     * If the request is successful, it updates the homeClicked observable with the new count.
     * If there is an error, it logs the error to the console.
     *
     * @returns {void}
     */
    increaseHomeCounter(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const request = this.homeCountService.incrementCount();

        request.pipe(
            catchError((error) => {
                console.error(error);
                return error;
            }),
        );

        request.subscribe((data: ApiResponse): void => {
            if (data.error) return console.error(data?.message);

            this.homeClicked.update((value: number): number => value + 1);
            console.log(`The Home Counter has already been clicked ${this.homeClicked()} times.`);
        });
    }
}
