import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { HomeCount } from "../../@types/homeCount.type";
import { ApiResponse } from "../../@types/apiResponse.type";
import { catchError, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class HomeCounterService {
    private http = inject(HttpClient);

    /**
     * Retrieves the current home counter value from the server.
     *
     * @returns {Observable<HomeCount>} An Observable of type HomeCount containing the current home counter value.
     */
    getCurrentCount(): Observable<HomeCount> {
        const request = this.http.get<HomeCount>("/api/public/getCurrentHomeCounter");

        request.pipe(
            catchError((error): any => {
                console.error(error);
                return error;
            }),
        );

        return request;
    }

    /**
     * Increments the home counter by making a POST request to the server.
     *
     * @returns {Observable<ApiResponse>} An observable containing the server's response.
     */
    incrementCount(): Observable<ApiResponse> {
        const request = this.http.post<ApiResponse>("/api/public/incrementHomeCounter", {});

        request.pipe(
            catchError((error): any => {
                console.error(error);
                return error;
            }),
        );

        return request;
    }
}
