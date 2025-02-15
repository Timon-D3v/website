import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { GetAllRoutesApiResponse } from "../../@types/apiResponse.type";
import { MetaFileSystem } from "../../@types/metaData.type";

@Injectable({
    providedIn: "root",
})
export class FileService {
    private http = inject(HttpClient);

    fileSystem = signal<MetaFileSystem | null>(null);

    updateFileSystem(): void {
        const request = this.http.get<GetAllRoutesApiResponse>("/files/private/getAllRoutes");

        request.pipe(
            catchError((error) => {
                console.error(error);
                return error;
            }),
        );

        request.subscribe((response: GetAllRoutesApiResponse) => {
            if (response.error) {
                console.error(response.message);
                return;
            }

            this.fileSystem.set(response.fileSystem as MetaFileSystem);
        });
    }

    getAllRoutes(): Observable<GetAllRoutesApiResponse> {
        const request = this.http.get<GetAllRoutesApiResponse>("/files/private/getAllRoutes");

        request.pipe(
            catchError((error) => {
                console.error(error);
                return error;
            }),
        );

        return request;
    }

    setPath(currentPath: string): string {
        const fileSystem = this.fileSystem();

        if (fileSystem === null) {
            console.error("File system is null. Cannot set path.");
            return "";
        }

        if (!fileSystem[currentPath]) {
            console.error("Path does not exist in file system.");
            return "";
        }

        console.log("Setting path to:", currentPath);

        const pathArray = currentPath.split("/");
        let displayPath = "";

        pathArray.forEach((path, index) => {
            if (index === 0) {
                displayPath += "root";
            } else {
                const tempPath = pathArray.slice(0, index + 1).join("/");
                displayPath += `/${fileSystem[tempPath].name}`;
            }
        });

        return displayPath;
    }
}
