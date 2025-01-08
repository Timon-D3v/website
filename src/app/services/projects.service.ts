import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ProjectApiResponse } from "../../@types/project.type";
import { catchError, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ProjectsService {
    http = inject(HttpClient);

    /**
     * Fetches all projects from the API.
     *
     * This method sends a GET request to the `/api/public/getAllProjects` endpoint
     * and returns an observable of the response containing the projects.
     *
     * @returns {Observable<ProjectApiResponse>} An observable containing the API response with the projects.
     *
     * @example
     * ```typescript
     * this.projectsService.getAllProjects().subscribe(
     *   (response) => {
     *     console.log(response.projects);
     *   },
     *   (error) => {
     *     console.error('Error fetching projects:', error);
     *   }
     * );
     * ```
     */
    getAllProjects(): Observable<ProjectApiResponse> {
        const request = this.http.get<ProjectApiResponse>("/api/public/getAllProjects");

        request.pipe(
            catchError((error) => {
                console.error(error);
                return error;
            }),
        );

        return request;
    }
}
