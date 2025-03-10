import { Component, effect, inject, input, output, signal } from "@angular/core";
import { randomString } from "timonjs";
import { filesize } from "filesize";
import { MetaData } from "../../../@types/metaData.type";
import { UserService } from "../../services/user.service";
import { ApiResponse } from "../../../@types/apiResponse.type";
import { FileService } from "../../services/file.service";

@Component({
    selector: "app-file-details-menu",
    imports: [],
    templateUrl: "./file-details-menu.component.html",
    styleUrl: "./file-details-menu.component.scss",
})
export class FileDetailsMenuComponent {
    file = input<MetaData | null>(null);

    closeSignal = output();

    id = randomString(22);

    filePath = signal<string>("root");
    fileSize = signal<string>("0 Bytes");
    username = signal<string>("-- Fehler --");
    uploadedAt = signal<string>("01. Jan. 1970 um 01:00");
    lastDownloadedAt = signal<string>("01. Jan. 1970 um 01:00");
    lastOpenedAt = signal<string>("01. Jan. 1970 um 01:00");

    private userService = inject(UserService);
    private fileService = inject(FileService);

    /**
     * Creates an instance of the FileDetailsMenuComponent.
     *
     * The constructor sets up a reactive effect that triggers whenever the `file` property changes.
     * If the `file` is not null, it calls the `updateConstants` method to update the component's constants.
     *
     * @constructor
     */
    constructor() {
        effect((): void => {
            if (this.file() === null) return;

            this.updateConstants();
        });
    }

    /**
     * Updates various constants related to the file details.
     *
     * This method performs the following actions:
     * - Sets the file path using the file service.
     * - Sets the file size using the filesize utility.
     * - Retrieves the username associated with the file's user ID and sets it.
     * - Sets the uploaded date, last downloaded date, and last opened date of the file.
     *
     * @returns {void}
     */
    updateConstants(): void {
        this.filePath.set(this.fileService.setPath(this.file()?.path || "root"));

        this.fileSize.set(filesize(this.file()?.size || 0));

        this.userService.getUsernameWithId(this.file()?.userId || 0).subscribe((response: { username: string; api: ApiResponse }): void => {
            if (response.api.error) {
                console.warn("Failed to retrieve username for user ID:", this.file()?.userId, "\nERROR:", response.api.message);
            }

            this.username.set(response.username);
        });

        this.uploadedAt.set(this.toRealDate(this.file()?.uploadedAt));
        this.lastDownloadedAt.set(this.toRealDate(this.file()?.lastDownloaded));
        this.lastOpenedAt.set(this.toRealDate(this.file()?.lastOpened));
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

    /**
     * Emits a signal to close the file details menu.
     * This method triggers the `closeSignal` event emitter.
     *
     * @returns {void}
     */
    close(): void {
        this.closeSignal.emit();
    }

    /**
     * Stops the propagation of the given event.
     *
     * This method prevents the event from bubbling up the DOM tree,
     * preventing any parent handlers from being notified of the event.
     *
     * @param {Event} event - The event whose propagation is to be stopped.
     * @returns {void}
     */
    stopPropagation(event: Event): void {
        event.stopPropagation();
    }
}
