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

    constructor() {
        effect(() => {
            if (this.x() === 0 && this.y() === 0) return;

            this.isVisible.set(true);
        });
    }

    openFile() {
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
        this.opener.update(value => value + 1);
    }

    moveFile() {}

    renameFile() {}

    downloadFile() {
        if (this.file() === null || !isPlatformBrowser(this.platformId)) return;

        const file = this.file() as MetaData;

        const a = document.createElement("a");
        a.href = "/files/private/file/" + file.fileName;
        a.target = "_blank";
        a.download = file.originalName;

        a.click();

        this.isVisible.set(false);
    }

    copyFile() {
        if (this.file() === null || !isPlatformBrowser(this.platformId)) return;

        const file = this.file() as MetaData;

        const request = this.fileService.downloadFile(file.fileName);

        request.subscribe((blob: Blob): void => {
            const item = new ClipboardItem({ [blob.type]: blob });

            navigator.clipboard.write([item])
            .then(() => {
                this.notificationService.success("Erfolg:", "Datei wurde in die Zwischenablage kopiert.");
            })
            .catch((error) => {
                console.error(error);
                this.notificationService.error("Fehler:", "Datei konnte nicht in die Zwischenablage kopiert werden.");
            });
        });

        this.isVisible.set(false);
    }

    shareFile() {}

    showFileDetails() {}

    deleteFile() {}

    close(): void {
        this.isVisible.set(false);
    }

    closeFilePreview(): void {
        this.imageIsShown.set(false);
        this.videoIsShown.set(false);
        this.audioIsShown.set(false);
        this.iframeIsShown.set(false);
        this.textIsShown.set(false);
    }
}
