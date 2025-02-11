import { Component, inject, PLATFORM_ID } from "@angular/core";
import { UploadService } from "../../services/upload.service";
import { MetaDataUpload } from "../../../@types/metaData.type";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-upload",
    imports: [],
    templateUrl: "./upload.component.html",
    styleUrl: "./upload.component.scss",
})
export class UploadComponent {
    uploadService = inject(UploadService);
    platformId = inject(PLATFORM_ID);

    onFileChange(event: any) {
        if (!isPlatformBrowser(this.platformId)) return;

        const file = event.target.files[0];
        const meta: MetaDataUpload = {
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            originalName: file.name,
            uploadedAt: Date.now(),
            currentPath: "root",
        };

        this.uploadService.uploadSingleFileSmall(file, meta).subscribe((response) => {
            console.log(response);
        });
    }
}
