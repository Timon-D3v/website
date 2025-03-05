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

    /**
     * Retrieves the username associated with a given user ID.
     *
     * @param {number} id - The ID of the user whose username is to be retrieved.
     * @returns {Observable<{ username: string; api: ApiResponse }>} An Observable that emits an object containing the username and an API response.
     *
     * @remarks
     * This method sends an HTTP GET request to the `/api/public/getUsernameWithId` endpoint with the user ID as a parameter.
     * If the request fails, a network error notification is displayed and the error is logged to the console.
     *
     * @example
     * ```typescript
     * this.userService.getUsernameWithId(123).subscribe(response => {
     *   console.log(response.username);
     * });
     * ```
     */
    getUsernameWithId(id: number): Observable<{ username: string; api: ApiResponse }> {
        const request = this.http.get<{ username: string; api: ApiResponse }>("/api/public/getUsernameWithId", {
            params: { id },
            responseType: "json",
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
