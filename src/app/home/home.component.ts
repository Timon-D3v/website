import { Component } from "@angular/core";
import { AdminComponent } from "../admin/admin.component";
import { HeroComponent } from "../components/hero/hero.component";

@Component({
    selector: "app-home",
    imports: [HeroComponent],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
})
export class HomeComponent {}
