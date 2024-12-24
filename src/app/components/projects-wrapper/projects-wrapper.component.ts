import { Component } from "@angular/core";
import { ProjectComponent } from "../project/project.component";

@Component({
    selector: "app-projects-wrapper",
    imports: [ProjectComponent],
    templateUrl: "./projects-wrapper.component.html",
    styleUrl: "./projects-wrapper.component.scss",
})
export class ProjectsWrapperComponent {}
