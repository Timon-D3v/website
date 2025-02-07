import { Component } from "@angular/core";
import { PathComponent } from "../components/path/path.component";
import { UploadComponent } from "../components/upload/upload.component";
import { CreateFolderComponent } from "../components/create-folder/create-folder.component";

@Component({
    selector: "app-files",
    imports: [PathComponent, UploadComponent, CreateFolderComponent],
    templateUrl: "./files.component.html",
    styleUrl: "./files.component.scss",
})
export class FilesComponent {}
