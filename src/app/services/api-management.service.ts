import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { catchError, Observable } from "rxjs";
import publicConfig from "../../public.config";
import { ApiResponse } from "../../@types/apiResponse.type";

@Injectable({
    providedIn: "root",
})
export class ApiManagementService {
    private http = inject(HttpClient);
    private notificationService = inject(NotificationService);

    generateApiKey(organizationName: string): Observable<ApiResponse> {
        const request = this.http.post<ApiResponse>("/api/private/admin/generateApiKey", {
            organizationName,
        });

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
