import { Component } from "@angular/core";
import { AddProjectsComponent } from "../components/add-projects/add-projects.component";

@Component({
    selector: "app-admin",
    imports: [AddProjectsComponent],
    templateUrl: "./admin.component.html",
    styleUrl: "./admin.component.scss",
})
export class AdminComponent {}
