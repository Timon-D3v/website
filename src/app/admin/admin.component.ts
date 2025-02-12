import { Component } from "@angular/core";
import { AddProjectsComponent } from "../components/add-projects/add-projects.component";
import { AddUserComponent } from "../components/add-user/add-user.component";

@Component({
    selector: "app-admin",
    imports: [AddProjectsComponent, AddUserComponent],
    templateUrl: "./admin.component.html",
    styleUrl: "./admin.component.scss",
})
export class AdminComponent {}
