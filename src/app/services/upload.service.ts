import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MetaDataUpload } from "../../@types/metaData.type";
import { ApiResponse } from "../../@types/apiResponse.type";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class UploadService {
    http = inject(HttpClient);

    uploadSingleFileSmall(file: File, meta: MetaDataUpload): Observable<ApiResponse> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("meta", JSON.stringify(meta));

        return this.http.post("/api/private/upload/single/small", formData) as Observable<ApiResponse>;
    }

    uploadSingleFileLarge() {}

    uploadMultipleFiles() {}
}
