import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MetaDataUpload } from "../../@types/metaData.type";
import { ApiResponse } from "../../@types/apiResponse.type";
import { lastValueFrom, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class UploadService {
    http = inject(HttpClient);

    async uploadSingleFileSmall(file: File, meta: MetaDataUpload): Promise<ApiResponse> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("meta", JSON.stringify(meta));

        return await lastValueFrom(this.http.post<ApiResponse>("/api/private/upload/single/small", formData));
    }

    async uploadChunk(formData: FormData) {
        return await lastValueFrom(this.http.post<ApiResponse>("/api/private/upload/single/big", formData));
    }
}
