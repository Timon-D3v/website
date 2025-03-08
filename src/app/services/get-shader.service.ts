import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { NotificationService } from "./notification.service";
import publicConfig from "../../public.config";

@Injectable({
    providedIn: "root",
})
export class GetShaderService {
    private http = inject(HttpClient);
    private notificationService = inject(NotificationService);

    /**
     * Fetches the shader code from the given URL.
     *
     * @param {string} url - The URL of the shader code to fetch.
     * @returns {Observable<string>} An Observable that emits the shader code as a string.
     */
    getShader(url: string): Observable<string> {
        const request = this.http.get(url, { responseType: "text" });

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
