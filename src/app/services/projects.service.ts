import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ProjectApiResponse } from "../../@types/project.type";
import { catchError, Observable } from "rxjs";
import { ApiResponse } from "../../@types/apiResponse.type";

@Injectable({
    providedIn: "root",
})
export class ProjectsService {
    private http = inject(HttpClient);

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
            catchError((error): any => {
                console.error(error);
                return error;
            }),
        );

        return request;
    }

    /**
     * Adds a new project to the API.
     *
     * This method sends a POST request to the `/api/private/admin/uploadProject` endpoint
     * with the project data and returns an observable of the response containing the new project.
     *
     * @param {FormData} projectData The project data to be uploaded.
     * @returns {Observable<ProjectApiResponse>} An observable containing the API response with the new project.
     *
     * @example
     * ```typescript
     * this.projectsService.addProject(formData).subscribe(
     *   (response) => {
     *     console.log(response.project);
     *   },
     *   (error) => {
     *     console.error('Error adding project:', error);
     *   }
     * );
     * ```
     */
    addProject(projectData: FormData): Observable<ApiResponse> {
        const request = this.http.post<ApiResponse>("/api/private/admin/uploadProject", projectData);

        request.pipe(
            catchError((error): any => {
                console.error(error);
                return error;
            }),
        );

        return request;
    }
}
