import { Component, inject, PLATFORM_ID } from "@angular/core";
import { UploadService } from "../../services/upload.service";
import { MetaDataUpload } from "../../../@types/metaData.type";
import { isPlatformBrowser } from "@angular/common";
import { FileService } from "../../services/file.service";
import { NotificationService } from "../../services/notification.service";
import { ApiResponse } from "../../../@types/apiResponse.type";
import { randomString } from "timonjs";

@Component({
    selector: "app-upload",
    imports: [],
    templateUrl: "./upload.component.html",
    styleUrl: "./upload.component.scss",
})
export class UploadComponent {
    private uploadService = inject(UploadService);
    private fileService = inject(FileService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

    onFileChange(event: any): void {
        if (!isPlatformBrowser(this.platformId)) return;

        switch (event.target.files.length) {
            case 0:
                return;
            case 1:
                this.singeFileUpload(event.target.files[0]);
                break;
            default:
                this.multipleFilesUpload(event.target.files);
                break;
        }
    }

    singeFileUpload(file: File) {
        const meta: MetaDataUpload = {
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            originalName: file.name,
            uploadedAt: Date.now(),
            currentPath: this.fileService.getCurrentPath(),
        };

        if (file.size > 50 * 1e6) {
            // 50 MB
            this.singeLargeFileUpload(file, meta);
        } else {
            this.singeSmallFileUpload(file, meta);
        }
    }

    multipleFilesUpload(files: File[]) {}

    singeSmallFileUpload(file: File, meta: MetaDataUpload) {
        this.uploadService.uploadSingleFileSmall(file, meta).subscribe((response: ApiResponse): void => {
            if (response.error) {
                this.notificationService.error("Fehler:", response.message);
                return;
            }

            this.notificationService.success("Erfolg:", response.message);
            this.fileService.updateFileSystem();
        });
    }

    async singeLargeFileUpload(file: File, meta: MetaDataUpload) {
        const CHUNK_SIZE = 50 * 1e6; // 50 MB
        const CHUNK_ID = "chunk_" + randomString(64);

        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        for (let index = 0; index < totalChunks; index++) {
            const start = index * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            console.log(`Uploading chunk ${index + 1} of ${totalChunks}`);

            const formData = new FormData();
            formData.append("chunkId", CHUNK_ID);
            formData.append("meta", JSON.stringify(meta));
            formData.append("chunkIndex", index.toString());
            formData.append("totalChunks", totalChunks.toString());
            formData.append("chunk", chunk);

            const response = await this.uploadService.uploadChunk(formData);

            if (response.error) {
                this.notificationService.error("Fehler:", response.message);
                return;
            }
        }
    }
}
