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

    /**
     * Handles the file input change event.
     *
     * This method is triggered when the user selects one or more files using the file input element.
     * It first checks if the code is running in a browser environment. If not, it exits early.
     * Then, it checks if any files were selected. If no files were selected, it exits early.
     * If files were selected, it proceeds to call the `multipleFilesUpload` method with the selected files.
     *
     * @param {Event} event - The file input change event containing the selected files.
     * @returns {void}
     */
    onFileChange(event: any): void {
        if (!isPlatformBrowser(this.platformId)) return;

        if (event.target.files.length === 0) return;

        this.multipleFilesUpload(event.target.files);
    }

    /**
     * Uploads a single file to the server. Depending on the file size, it delegates
     * the upload process to either `singleLargeFileUpload` or `singleSmallFileUpload`.
     *
     * @param {File} file - The file to be uploaded.
     * @returns {Promise<ApiResponse>} A promise that resolves to an `ApiResponse` object.
     *
     * The function also generates metadata for the file, including:
     * - `size`: The size of the file in bytes.
     * - `type`: The MIME type of the file. If the type is not available, it defaults to "unknown".
     * - `lastModified`: The last modified timestamp of the file.
     * - `originalName`: The original name of the file.
     * - `uploadedAt`: The timestamp when the file was uploaded.
     * - `currentPath`: The current path where the file is being uploaded, retrieved from `fileService`.
     *
     * If the file size is greater than 50 MB, the file is uploaded using `singleLargeFileUpload`.
     * Otherwise, it is uploaded using `singleSmallFileUpload`.
     */
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

    /**
     * Uploads multiple files sequentially and updates the progress.
     *
     * @param {File[]} files - An array of File objects to be uploaded.
     * @returns {Promise<void>} A Promise that resolves when all files have been uploaded.
     *
     * The method performs the following steps:
     * 1. Sets the progress visibility to true and initializes the progress value and maximum.
     * 2. Iterates over each file and uploads it using the `singleFileUpload` method.
     * 3. If an error occurs during the upload of a file, it shows an error notification and continues with the next file.
     * 4. If the upload is successful, it shows a success notification.
     * 5. Updates the file system after all files have been processed.
     * 6. Sets the progress visibility to false.
     */
    async multipleFilesUpload(files: File[]): Promise<void> {
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

    /**
     * Uploads a single small file with associated metadata.
     *
     * @param {File} file - The file to be uploaded.
     * @param {MetaDataUpload} meta - Metadata associated with the file upload.
     * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse object.
     *
     * The ApiResponse object contains:
     * - `error`: A boolean indicating if there was an error during the upload.
     * - `message`: A string message providing details about the upload status.
     *
     * If the upload is successful, the progress value is incremented by 1 and a success message is returned.
     * If there is an error, the response containing the error details is returned.
     */
    async singleSmallFileUpload(file: File, meta: MetaDataUpload): Promise<ApiResponse> {
        const response = await this.uploadService.uploadSingleFileSmall(file, meta);

        if (response.error) {
            return response;
        }

        this.progressValue.update((value: number): number => value + 1);

        return {
            error: false,
            message: `Die Datei "${meta.originalName}" wurde erfolgreich hochgeladen.`,
        };
    }

    /**
     * Uploads a large file in chunks to the server.
     *
     * @param {File} file - The file to be uploaded.
     * @param {MetaDataUpload} meta - Metadata associated with the upload.
     * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse indicating the success or failure of the upload.
     *
     * The function splits the file into chunks of 50 MB each and uploads them sequentially.
     * If an error occurs during the upload of a chunk, it retries the upload.
     * The progress of the upload is updated after each successful chunk upload.
     */
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

            this.progressValue.update((value: number): number => value + 1 / totalChunks);
        }

        return {
            error: false,
            message: `Die Datei "${meta.originalName}" wurde erfolgreich hochgeladen.`,
        };
    }

    /**
     * Retries the upload of a file chunk up to a maximum of 5 attempts.
     *
     * @param {Blob} chunk - The file chunk to be uploaded.
     * @param {string} chunkId - The unique identifier for the chunk.
     * @param {number} chunkIndex - The index of the chunk in the sequence of chunks.
     * @param {number} totalChunks - The total number of chunks for the file.
     * @param {MetaDataUpload} meta - Metadata related to the file upload.
     * @param {number} tries = 0 - The current number of retry attempts (default is 0).
     * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse indicating the success or failure of the upload.
     */
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
