import { Component, effect, inject, input, output, signal } from "@angular/core";
import { MetaFolder } from "../../../@types/metaData.type";
import { FileService } from "../../services/file.service";
import { AuthService } from "../../services/auth.service";
import { RouterLink } from "@angular/router";
import { filesize } from "filesize";

@Component({
    selector: "app-folder-details-menu",
    imports: [RouterLink],
    templateUrl: "./folder-details-menu.component.html",
    styleUrl: "./folder-details-menu.component.scss",
})
export class FolderDetailsMenuComponent {
    folder = input<MetaFolder | null>(null);

    path = signal<string>("root");
    displayPath = signal<string>("root");
    username = signal<string>("-- Fehler --");
    size = signal<string>("0 Bytes");
    folders = signal<number>(0);
    files = signal<number>(0);

    closeSignal = output();

    private fileService = inject(FileService);
    private authService = inject(AuthService);

    constructor() {
        effect((): void => {
            if (this.folder() === null) return;

            this.updateConstants();
        });
    }

    updateConstants(): void {
        this.updatePath();

        const { size, files, folders } = this.updateSize(this.path());

        this.size.set(filesize(size));
        this.folders.set(folders);
        this.files.set(files);
        this.displayPath.set(this.fileService.setPath(this.path()));

        this.username.set(this.authService.currentUser()?.name + " " + this.authService.currentUser()?.familyName);
    }

    updatePath(): void {
        const currentPath = this.fileService.getCurrentPath();
        const currentFolder = this.fileService.fileSystem()?.[currentPath];

        if (currentFolder === undefined) return;

        const folderPath = currentFolder.folders.find((folder: string): boolean => {
            return this.fileService.fileSystem()?.[folder].name === this.folder()?.name
        });

        this.path.set(folderPath as string);
    }

    updateSize(path: string): { size: number; folders: number; files: number } {
        const folder = this.fileService.fileSystem()?.[path];

        if (folder === undefined) return { size: 0, folders: 0, files: 0 };

        let size = 0;
        let files = 0;
        let folders = 0;

        for (const file of folder.files) {
            size += file.size;
            files++;
        }

        for (const subfolder of folder.folders) {
            const result = this.updateSize(subfolder);
            size += result.size;
            folders += result.folders + 1;
            files += result.files;
        }

        return { size, folders, files };
    }

    /**
     * Converts a timestamp to a formatted date string in the "de-CH" locale.
     *
     * @param {number} date - The timestamp to convert. Defaults to 0 if not provided.
     * @returns {string} A string representing the formatted date and time.
     *
     * The format of the returned string is "dd. MMM yyyy um HH:mm".
     */
    toRealDate(date: number = 0): string {
        return new Date(date)
            .toLocaleDateString("de-CH", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            .replace(",", " um");
    }

    close(): void {
        this.closeSignal.emit();
    }

    stopPropagation(event: MouseEvent): void {
        event.stopPropagation();
    }
}
