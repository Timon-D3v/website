import { Component, inject, PLATFORM_ID } from "@angular/core";
import { UploadService } from "../../services/upload.service";
import { MetaDataUpload } from "../../../@types/metaData.type";
import { isPlatformBrowser } from "@angular/common";
import { FileService } from "../../services/file.service";
import { NotificationService } from "../../services/notification.service";
import { ApiResponse } from "../../../@types/apiResponse.type";

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

    onFileChange(event: any) {
        if (!isPlatformBrowser(this.platformId)) return;

        const file = event.target.files[0];
        const meta: MetaDataUpload = {
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            originalName: file.name,
            uploadedAt: Date.now(),
            currentPath: this.fileService.getCurrentPath(),
        };

        this.uploadService.uploadSingleFileSmall(file, meta).subscribe((response: ApiResponse): void => {
            if (response.error) {
                this.notificationService.error("Fehler:", response.message);
                return;
            }

            this.notificationService.success("Erfolg:", response.message);
            this.fileService.updateFileSystem();
        });
    }
}
