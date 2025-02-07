import { Component, inject } from "@angular/core";
import { UploadService } from "../../services/upload.service";
import { MetaDataUpload } from "../../../@types/metaData.type";

@Component({
    selector: "app-upload",
    imports: [],
    templateUrl: "./upload.component.html",
    styleUrl: "./upload.component.scss",
})
export class UploadComponent {
    uploadService = inject(UploadService);

    onFileChange(event: any) {
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
