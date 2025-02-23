import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { HomeCount } from "../../@types/homeCount.type";
import { ApiResponse } from "../../@types/apiResponse.type";
import { Observable } from "rxjs";

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
        return this.http.get<HomeCount>("/api/public/getCurrentHomeCounter");
    }

    /**
     * Increments the home counter by making a POST request to the server.
     *
     * @returns {Observable<ApiResponse>} An observable containing the server's response.
     */
    incrementCount(): Observable<ApiResponse> {
        return this.http.post<ApiResponse>("/api/public/incrementHomeCounter", {});
    }
}
