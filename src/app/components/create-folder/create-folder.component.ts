import { Component } from "@angular/core";

@Component({
    selector: "app-create-folder",
    imports: [],
    templateUrl: "./create-folder.component.html",
    styleUrl: "./create-folder.component.scss",
})
export class CreateFolderComponent {
    createNewFolder() {
        console.log("Creating a new folder");
    }
}
