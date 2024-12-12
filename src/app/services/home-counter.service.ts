import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HomeCount } from '../../@types/homeCount.type';
import { ApiResponse } from '../../@types/apiResponse.type';

@Injectable({
    providedIn: "root"
})
export class HomeCounterService {
    http = inject(HttpClient);

    getCurrentCount() {
        return this.http.get("/api/public/getCurrentHomeCounter");
    }

    incrementCount() {
        return this.http.post<ApiResponse>("/api/public/incrementHomeCounter", {});
    }
}
