import { Component, input } from "@angular/core";
import { MetaFolder } from "../../../@types/metaData.type";
import { RouterLink } from "@angular/router";
import { ContextMenuFolderComponent } from "../../components/context-menu-folder/context-menu-folder.component";

@Component({
    selector: "app-folder",
    imports: [RouterLink, ContextMenuFolderComponent],
    templateUrl: "./folder.component.html",
    styleUrl: "./folder.component.scss",
})
export class FolderComponent {
    folder = input<MetaFolder>();
    urlParams = input<{ path: string }>({ path: "" });
}
