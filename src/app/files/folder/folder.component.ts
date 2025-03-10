import { Component, input, signal } from "@angular/core";
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
    folder = input<MetaFolder | null>(null);
    urlParams = input<{ path: string }>({ path: "" });

    contextX = signal(0);
    contextY = signal(0);

    /**
     * Handles the right-click event on the component.
     *
     * @param {MouseEvent} event - The mouse event triggered by the right-click action.
     * @returns {void}
     *
     * This method prevents the default context menu from appearing and sets the
     * context menu's X and Y coordinates based on the mouse click position.
     */
    rightClick(event: MouseEvent): void {
        event.preventDefault();

        this.contextX.set(event.clientX);
        this.contextY.set(event.clientY);
    }
}
