import { Component, effect, inject, input, PLATFORM_ID, signal } from "@angular/core";
import { NotificationService } from "../../services/notification.service";
import { FileService } from "../../services/file.service";
import { ConfirmComponent } from "../confirm/confirm.component";
import { MetaFolder } from "../../../@types/metaData.type";
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-context-menu-folder",
    imports: [ConfirmComponent],
    templateUrl: "./context-menu-folder.component.html",
    styleUrl: "./context-menu-folder.component.scss",
})
export class ContextMenuFolderComponent {
    folder = input<MetaFolder | null>(null);
    urlParams = input<{ path: string }>({ path: "" });
    x = input(0);
    y = input(0);

    isVisible = signal(false);

    private notificationService = inject(NotificationService);
    private fileService = inject(FileService);
    private router = inject(Router);

    deleteConfirmVisible = signal(false);
    deleteConfirmText = signal("Willst du diese Datei wirklich löschen?");

    private platformId = inject(PLATFORM_ID);

    constructor() {
        effect((): void => {
            if (this.x() === 0 && this.y() === 0) return;

            this.isVisible.set(true);
        });
    }

    openFolder(): void {
        if (this.folder() === null || !isPlatformBrowser(this.platformId)) return;

        this.isVisible.set(false);

        this.router.navigate(["/files"], { queryParams: this.urlParams() });
    }

    /**
     * @todo Implement the moveFolder method.
     */
    moveFolder(): void {
        this.notificationService.error("Fehler:", "Diese Funktion ist noch nicht implementiert.");
    }

    renameFolder(): void {}

    downloadFolder(): void {}

    shareFolder(): void {}

    showFolderDetails(): void {}

    deleteFolder(): void {
        if (this.folder() === null || !isPlatformBrowser(this.platformId)) return;

        this.deleteConfirmText.set(`Willst du den Ordner "${this.folder()?.name}" und alle Unterordner und Dateien wirklich löschen?`);
        this.deleteConfirmVisible.set(true);

        this.isVisible.set(false);
    }

    async confirmDeleteFolder(result: boolean): Promise<void> {
        if (this.folder() === null || !isPlatformBrowser(this.platformId)) return;

        this.deleteConfirmVisible.set(false);

        if (!result) return;

        const response = await this.fileService.deleteFolder(this.folder()?.name as string);

        this.fileService.updateFileSystem();

        if (response.error) {
            this.notificationService.error("Fehler:", response.message);
            return;
        }

        this.notificationService.success("Erfolg:", response.message);
    }

    close() {
        this.isVisible.set(false);
    }
}
