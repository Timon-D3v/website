import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiResponse } from "../../@types/apiResponse.type";
import { catchError, Observable } from "rxjs";
import { NotificationService } from "./notification.service";

@Injectable({
    providedIn: "root",
})
export class UserService {
    private http = inject(HttpClient);
    private notificationService = inject(NotificationService);

    /**
     * Adds a new user with the provided email, name, and family name.
     * Sends a POST request to the server to create the user.
     *
     * @param {string} email - The email address of the new user.
     * @param {string} name - The first name of the new user.
     * @param {string} familyName - The family name (surname) of the new user.
     * @returns {Observable<ApiResponse>} An observable containing the server's response.
     */
    addUser(email: string, name: string, familyName: string): Observable<ApiResponse> {
        const request = this.http.post<ApiResponse>("/api/private/admin/addUser", {
            email,
            name,
            familyName,
        });

        request.pipe(
            catchError((error): any => {
                this.notificationService.error("Netzwerkfehler", "Es konnte keine Verbindung hergestellt werden. Stelle sicher, dass du eingeloggt bis und eine Internetverbindung hast.");
                console.error(error);
                return error;
            }),
        );

        return request;
    }
}
