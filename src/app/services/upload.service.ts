import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MetaDataUpload } from "../../@types/metaData.type";
import { ApiResponse } from "../../@types/apiResponse.type";
import { lastValueFrom, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class UploadService {
    private http = inject(HttpClient);

    /**
     * Uploads a single small file to the server.
     *
     * @param {File} file - The file to be uploaded.
     * @param {MetaDataUpload} meta - Metadata associated with the file upload.
     * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse object.
     */
    async uploadSingleFileSmall(file: File, meta: MetaDataUpload): Promise<ApiResponse> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("meta", JSON.stringify(meta));

        return await lastValueFrom(this.http.post<ApiResponse>("/api/private/upload/single/small", formData));
    }

    /**
     * Uploads a chunk of data to the server.
     *
     * @param {FormData} formData - The form data containing the chunk to be uploaded.
     * @returns {Promise<ApiResponse>} A promise that resolves to the server's response.
     */
    async uploadChunk(formData: FormData): Promise<ApiResponse> {
        return await lastValueFrom(this.http.post<ApiResponse>("/api/private/upload/single/big", formData));
    }
}
