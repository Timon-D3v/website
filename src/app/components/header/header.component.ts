import { Component, inject, OnInit, signal } from "@angular/core";
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { LoginButtonComponent } from "../login-button/login-button.component";
import { HomeCounterService } from "../../services/home-counter.service";
import { catchError } from "rxjs";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-header",
    imports: [PrimaryButtonComponent, LoginButtonComponent, RouterLink],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss"
})
export class HeaderComponent implements OnInit {
    homeClicked = signal(0);
    homeCountService = inject(HomeCounterService);

    ngOnInit(): void {
        this.getHomeCount();
    }

    getHomeCount(): void {
        const request = this.homeCountService.getCurrentCount();

        request.pipe(catchError((error) => {
            console.error(error);
            return error;
        }));

        request.subscribe((data: any) => {
            if (data.error) return console.error(data.message);

            this.homeClicked.set(data.count);
        });
    }

    increaseHomeCounter() {
        const request = this.homeCountService.incrementCount();

        request.pipe(catchError((error) => {
            console.error(error);
            return error;
        }));

        request.subscribe((data: any) => {
            if (data.error) return console.error(data.message);

            this.homeClicked.update(value => value + 1);
            console.log(`The Home Counter has already been clicked ${this.homeClicked()} times.`);
        });
    }
}
