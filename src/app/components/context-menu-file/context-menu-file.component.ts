import { Component, effect, inject, input, PLATFORM_ID, signal } from "@angular/core";
import { MetaData } from "../../../@types/metaData.type";
import { NotificationService } from "../../services/notification.service";
import { FileService } from "../../services/file.service";
import { DisplayAudioFileComponent } from "../display-audio-file/display-audio-file.component";
import { DisplayImageFileComponent } from "../display-image-file/display-image-file.component";
import { DisplayVideoFileComponent } from "../display-video-file/display-video-file.component";
import { DisplayIframeFileComponent } from "../display-iframe-file/display-iframe-file.component";
import { DisplayTextFileComponent } from "../display-text-file/display-text-file.component";
import { isPlatformBrowser } from "@angular/common";
import { ApiResponse } from "../../../@types/apiResponse.type";

@Component({
    selector: "app-context-menu-file",
    imports: [DisplayAudioFileComponent, DisplayImageFileComponent, DisplayVideoFileComponent, DisplayIframeFileComponent, DisplayTextFileComponent],
    templateUrl: "./context-menu-file.component.html",
    styleUrl: "./context-menu-file.component.scss",
})
export class ContextMenuFileComponent {
    x = input(0);
    y = input(0);
    file = input<MetaData | null>(null);

    isVisible = signal(false);

    private notificationService = inject(NotificationService);
    private fileService = inject(FileService);

    imageIsShown = signal(false);
    videoIsShown = signal(false);
    audioIsShown = signal(false);
    iframeIsShown = signal(false);
    textIsShown = signal(false);

    opener = signal(0);

    private platformId = inject(PLATFORM_ID);

    /**
     * Creates an instance of the ContextMenuFileComponent.
     *
     * The constructor sets up an effect that monitors the x and y coordinates.
     * If both coordinates are not zero, it sets the visibility of the context menu to true.
     *
     * @constructor
     */
    constructor() {
        effect((): void => {
            if (this.x() === 0 && this.y() === 0) return;

            if (this.x() === 0.123 && this.y() === 0.123) {
                this.openFile();
                return;
            }

            this.isVisible.set(true);
        });
    }

    /**
     * Opens a file based on its type and displays the appropriate viewer.
     *
     * This method checks the type of the file and sets the corresponding viewer to be shown.
     * It supports displaying images, videos, PDFs, audio files, and various text files.
     * If the file type is not supported, an error notification is shown.
     *
     * @returns {void}
     *
     * @remarks
     * This method relies on the `file` method to retrieve the file metadata and the `isPlatformBrowser` function
     * to check if the code is running in a browser environment.
     *
     * @throws Will show an error notification if the file type is not supported.
     *
     * @example
     * ```typescript
     * // Assuming `contextMenuFileComponent` is an instance of the component
     * contextMenuFileComponent.openFile();
     * ```
     */
    openFile(): void {
        if (this.file() === null || !isPlatformBrowser(this.platformId)) return;

        const file = this.file() as MetaData;

        if (file.type.startsWith("image/")) {
            this.imageIsShown.set(true);
        } else if (file.type.startsWith("video/")) {
            this.videoIsShown.set(true);
        } else if (file.fileName.endsWith(".pdf")) {
            this.iframeIsShown.set(true);
        } else if (file.fileName.endsWith(".mp3") || file.fileName.endsWith(".wav")) {
            this.audioIsShown.set(true);
        } else if (
            file.fileName.endsWith(".txt") ||
            file.fileName.endsWith(".js") ||
            file.fileName.endsWith(".css") ||
            file.fileName.endsWith(".html") ||
            file.fileName.endsWith(".json") ||
            file.fileName.endsWith(".ts") ||
            file.fileName.endsWith(".sql") ||
            file.fileName.endsWith(".md") ||
            file.fileName.endsWith(".py") ||
            file.fileName.endsWith(".sass") ||
            file.fileName.endsWith(".scss") ||
            file.fileName.endsWith(".log") ||
            file.fileName.endsWith(".vscode") ||
            file.fileName.endsWith(".java") ||
            file.fileName.endsWith(".c") ||
            file.fileName.endsWith(".cpp") ||
            file.fileName.endsWith(".cs") ||
            file.fileName.endsWith(".go") ||
            file.fileName.endsWith(".php") ||
            file.fileName.endsWith(".rb") ||
            file.fileName.endsWith(".swift") ||
            file.fileName.endsWith(".sh") ||
            file.fileName.endsWith(".bat") ||
            file.fileName.endsWith(".cmd") ||
            file.fileName.endsWith(".xml") ||
            file.fileName.endsWith(".vbs")
        ) {
            this.textIsShown.set(true);
        } else {
            this.notificationService.error("Fehler:", "Dieser Dateityp kann nicht geöffnet werden.");
        }

        this.isVisible.set(false);
        this.opener.update((value) => value + 1);
    }

    /**
     * @todo Implement the moveFile method.
     */
    moveFile() {}

    /**
     * Initiates the renaming process for a file.
     * 
     * This method performs the following actions:
     * 1. Checks if the file is null or if the platform is not a browser, and returns early if either condition is true.
     * 2. Hides the context menu.
     * 3. Attempts to find the HTML element associated with the file to be renamed.
     * 4. If the element is not found, displays an error notification and logs an error to the console.
     * 5. Makes the element content editable, adjusts its style, and sets focus on it.
     * 6. Adds event listeners to handle confirming or canceling the file rename operation.
     * 
     * @returns {void}
     */
    renameFile(): void {
        if (this.file() === null || !isPlatformBrowser(this.platformId)) return;

        this.isVisible.set(false);

        const element = document.getElementById("rename_" + this.file()?.fileName)

        if (element === null) {
            this.notificationService.error("Fehler:", "Dieses Element konnte nicht gefunden werden.");
            console.error("Element not found");
            return;
        };

        element.contentEditable = "true";
        element.style.textOverflow = "clip";
        element.focus();

        element.addEventListener("keydown", (event: KeyboardEvent): void => this.confirmFileRename(event, element as HTMLHeadingElement));
        element.addEventListener("keydown", (event: KeyboardEvent): void => this.cancelFileRename(event, element as HTMLHeadingElement));
    }

    /**
     * Handles the confirmation of a file rename operation when the Enter key is pressed.
     * 
     * @param {KeyboardEvent} event - The keyboard event triggered by pressing a key.
     * @param {HTMLHeadingElement} element - The HTML heading element that contains the new file name.
     * 
     * This method performs the following actions:
     * - Prevents the default action and stops the propagation of the event.
     * - Sets the contentEditable property of the element to "false" and adjusts its style.
     * - Retrieves the new file name from the element's innerText.
     * - If the new name is the same as the original name, the method returns early.
     * - Sends a request to rename the file using the fileService.
     * - Subscribes to the response of the rename request and updates the element's innerText with the new name.
     * - Updates the file system using the fileService.
     * - Displays a success or error notification based on the response.
     * - Removes the event listeners for confirming and canceling the file rename.
     * 
     * @returns {void}
     */
    confirmFileRename(event: KeyboardEvent, element: HTMLHeadingElement): void {
        if (event.key !== "Enter") return
        
        event.stopPropagation();
        event.preventDefault();

        element.contentEditable = "false";
        element.style.textOverflow = "ellipsis";

        const newName = element.innerText;

        if (newName === this.file()?.originalName) return;

        const request = this.fileService.renameFile(this.file()?.originalName as string, newName);

        request.subscribe((response: { api: ApiResponse; name: string }): void => {
            element.innerText = response.name;

            this.fileService.updateFileSystem();

            if (response.api.error) {
                console.error("Error renaming file", response.api.message);
                this.notificationService.error("Fehler:", response.api.message);
                return;
            }

            this.notificationService.success("Erfolg:", response.api.message);
        });

        element.removeEventListener("keydown", (): void => this.confirmFileRename(event, element));
        element.removeEventListener("keydown", (): void => this.cancelFileRename(event, element));
    }

    /**
     * Cancels the file rename operation when the Escape key is pressed.
     * 
     * @param {KeyboardEvent} event - The keyboard event that triggered the function.
     * @param {HTMLHeadingElement} element - The HTML heading element that is being edited.
     * 
     * The function stops the propagation and default behavior of the event,
     * sets the contentEditable property of the element to false, restores the
     * original file name, and removes the event listeners for confirming and
     * canceling the file rename.
     * 
     * @returns {void}
     */
    cancelFileRename(event: KeyboardEvent, element: HTMLHeadingElement): void {
        if (event.key !== "Escape") return;

        event.stopPropagation();
        event.preventDefault();

        element.contentEditable = "false";
        element.style.textOverflow = "ellipsis";
        element.innerText = this.file()?.originalName as string;

        element.removeEventListener("keydown", (): void => this.confirmFileRename(event, element));
        element.removeEventListener("keydown", (): void => this.cancelFileRename(event, element));
    }


    /**
     * Initiates the download of a file by creating an anchor element and triggering a click event on it.
     * The file to be downloaded is retrieved from the component's `file` method.
     * The download is only initiated if the file is not null and the code is running in a browser environment.
     *
     * @remarks
     * - The file URL is constructed using the file's `fileName` property.
     * - The download attribute of the anchor element is set to the file's `originalName`.
     * - The visibility of the context menu is set to false after initiating the download.
     *
     * @returns {void}
     */
    downloadFile(): void {
        if (this.file() === null || !isPlatformBrowser(this.platformId)) return;

        const file = this.file() as MetaData;

        const a = document.createElement("a");
        a.href = "/files/private/file/" + file.fileName;
        a.target = "_blank";
        a.download = file.originalName;

        a.click();

        this.isVisible.set(false);
    }

    /**
     * Copies the selected file to the clipboard.
     *
     * This method checks if a file is selected and if the code is running in a browser environment.
     * If both conditions are met, it requests the file from the file service, converts it to a
     * ClipboardItem, and writes it to the clipboard. Upon successful copy, a success notification
     * is shown. If the copy fails, an error notification is displayed.
     *
     * @returns {void}
     */
    copyFile(): void {
        if (this.file() === null || !isPlatformBrowser(this.platformId)) return;

        const file = this.file() as MetaData;

        const request = this.fileService.downloadFile(file.fileName);

        request.subscribe((blob: Blob): void => {
            const item = new ClipboardItem({ [blob.type]: blob });

            navigator.clipboard
                .write([item])
                .then((): void => {
                    this.notificationService.success("Erfolg:", "Datei wurde in die Zwischenablage kopiert.");
                })
                .catch((error: Error): void => {
                    console.error(error);
                    this.notificationService.error("Fehler:", "Datei konnte nicht in die Zwischenablage kopiert werden.");
                });
        });

        this.isVisible.set(false);
    }

    /**
     * @todo Implement the shareFile method.
     */
    shareFile() {}

    /**
     * @todo Implement the showFileDetails method.
     */
    showFileDetails() {}

    /**
     * @todo Implement the deleteFile method.
     */
    deleteFile() {}

    /**
     * Closes the context menu by setting its visibility to false.
     *
     * @returns {void} This method does not return a value.
     */
    close(): void {
        this.isVisible.set(false);
    }

    /**
     * Closes the file preview by hiding all types of media elements.
     *
     * This method sets the visibility of image, video, audio, iframe, and text elements to false.
     * It ensures that no media elements are shown in the file preview.
     *
     * @returns {void}
     */
    closeFilePreview(): void {
        this.imageIsShown.set(false);
        this.videoIsShown.set(false);
        this.audioIsShown.set(false);
        this.iframeIsShown.set(false);
        this.textIsShown.set(false);
    }
}
