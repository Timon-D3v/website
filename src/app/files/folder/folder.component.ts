import { Component, input } from "@angular/core";
import { MetaFolder } from "../../../@types/metaData.type";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-folder",
    imports: [RouterLink],
    templateUrl: "./folder.component.html",
    styleUrl: "./folder.component.scss",
})
export class FolderComponent {
    folder = input<MetaFolder>();
    urlParams = input<{ path: string }>({ path: "" });
}
