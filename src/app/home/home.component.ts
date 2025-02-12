import { Component } from "@angular/core";
import { AboutMeComponent } from "../components/about-me/about-me.component";
import { HeroComponent } from "../components/hero/hero.component";
import { ProjectsWrapperComponent } from "../components/projects-wrapper/projects-wrapper.component";
import { ContactFormComponent } from "../components/contact-form/contact-form.component";

@Component({
    selector: "app-home",
    imports: [HeroComponent, AboutMeComponent, ProjectsWrapperComponent, ContactFormComponent],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
})
export class HomeComponent {}
