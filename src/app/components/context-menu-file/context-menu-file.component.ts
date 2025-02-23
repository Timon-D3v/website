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
     * @todo Implement the renameFile method.
     */
    renameFile() {}

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
