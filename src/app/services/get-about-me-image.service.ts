import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { NotificationService } from "./notification.service";
import publicConfig from "../../public.config";

@Injectable({
    providedIn: "root",
})
export class GetAboutMeImageService {
    private http = inject(HttpClient);
    private notificationService = inject(NotificationService);

    /**
     * Fetches an image from the specified URL and returns it as an Observable of Blob.
     *
     * @param {string} url - The URL of the image to fetch.
     * @returns {Observable<Blob>} An Observable that emits the image as a Blob.
     */
    getImage(url: string): Observable<Blob> {
        const request = this.http.get(url, { responseType: "blob" });

        request.pipe(
            catchError((error): any => {
                this.notificationService.error("Netzwerkfehler", publicConfig.ERRORS.NETWORK);
                console.error(error);
                return error;
            }),
        );

        return request;
    }
}
