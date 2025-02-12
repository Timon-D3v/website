import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiResponse } from "../../@types/apiResponse.type";
import { catchError, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class UserService {
    http = inject(HttpClient);

    addUser(email: string, name: string, familyName: string): Observable<ApiResponse> {
        const request = this.http.post<ApiResponse>("/api/private/admin/addUser", {
            email,
            name,
            familyName,
        });

        request.pipe(
            catchError((error) => {
                console.error(error);
                return error;
            }),
        );

        return request
    }
}
