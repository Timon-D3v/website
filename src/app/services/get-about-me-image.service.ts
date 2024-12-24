import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class GetAboutMeImageService {
    http = inject(HttpClient);

    getImage(url: string): Observable<Blob> {
        const request = this.http.get(url, { responseType: "blob" });

        request.pipe(
            catchError((error) => {
                console.error(error);
                return error;
            }),
        );

        return request;
    }
}
