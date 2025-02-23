import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
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

    progressVisible = signal(false);
    progressValue = signal(0);
    progressMax = signal(100);

    onFileChange(event: any): void {
        if (!isPlatformBrowser(this.platformId)) return;

        if (event.target.files.length === 0) return;

        this.multipleFilesUpload(event.target.files);
    }

    async singleFileUpload(file: File): Promise<ApiResponse> {
        const meta: MetaDataUpload = {
            size: file.size,
            type: file.type === "" ? "unknown" : file.type,
            lastModified: file.lastModified,
            originalName: file.name,
            uploadedAt: Date.now(),
            currentPath: this.fileService.getCurrentPath(),
        };

        if (file.size > 50 * 1e6) {
            // < 50 MB
            return await this.singleLargeFileUpload(file, meta);
        } else {
            return await this.singleSmallFileUpload(file, meta);
        }
    }

    async multipleFilesUpload(files: File[]) {
        this.progressVisible.set(true);
        this.progressValue.set(0);
        this.progressMax.set(files.length);

        for (const file of files) {
            const response = await this.singleFileUpload(file);

            if (response.error) {
                this.notificationService.error("Fehler:", response.message);
                continue;
            }

            this.notificationService.success("Erfolg:", response.message);
        }

        this.fileService.updateFileSystem();
        this.progressVisible.set(false);
    }

    async singleSmallFileUpload(file: File, meta: MetaDataUpload): Promise<ApiResponse> {
        const response = await this.uploadService.uploadSingleFileSmall(file, meta);

        if (response.error) {
            return response;
        }

        this.progressValue.update((value) => value + 1);

        return {
            error: false,
            message: `Die Datei "${meta.originalName}" wurde erfolgreich hochgeladen.`,
        };
    }

    async singleLargeFileUpload(file: File, meta: MetaDataUpload): Promise<ApiResponse> {
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
                return this.retryChunkUpload(chunk, CHUNK_ID, index, totalChunks, meta);
            }

            this.progressValue.update((value) => value + 1 / totalChunks);
        }

        return {
            error: false,
            message: `Die Datei "${meta.originalName}" wurde erfolgreich hochgeladen.`,
        };
    }

    async retryChunkUpload(chunk: Blob, chunkId: string, chunkIndex: number, totalChunks: number, meta: MetaDataUpload, tries: number = 0): Promise<ApiResponse> {
        if (tries > 5) {
            return {
                error: true,
                message: `Die Datei "${meta.originalName}" konnte nicht hochgeladen werden.`,
            };
        }

        const formData = new FormData();
        formData.append("chunkId", chunkId);
        formData.append("meta", JSON.stringify(meta));
        formData.append("chunkIndex", chunkIndex.toString());
        formData.append("totalChunks", totalChunks.toString());
        formData.append("chunk", chunk);

        const response = await this.uploadService.uploadChunk(formData);

        if (response.error) {
            return await this.retryChunkUpload(chunk, chunkId, chunkIndex, totalChunks, meta, tries + 1);
        } else {
            return response;
        }
    }
}
