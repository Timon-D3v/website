import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ProjectApiResponse } from "../../@types/project.type";
import { catchError } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ProjectsService {
    http = inject(HttpClient);

    getAllProjects() {
        const request = this.http.get<ProjectApiResponse>("/api/public/getAllProjects");

        request.pipe(
            catchError((error) => {
                console.error(error);
                return error;
            })
        );

        return request;
    }
}
