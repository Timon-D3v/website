import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class GetShaderService {
    http = inject(HttpClient);

    getShader(url: string): Observable<string> {
        const request = this.http.get(url, { responseType: "text" });

        request.pipe(
            catchError((error) => {
                console.error(error);
                return error;
            }),
        );

        return request;
    }
}
