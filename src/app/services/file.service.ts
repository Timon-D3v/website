import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { ApiResponse, GetAllRoutesApiResponse } from "../../@types/apiResponse.type";
import { MetaFileSystem } from "../../@types/metaData.type";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class FileService {
    private http = inject(HttpClient);
    private router = inject(Router);

    fileSystem = signal<MetaFileSystem | null>(null);

    /**
     * Updates the file system by making an HTTP GET request to retrieve all routes.
     *
     * This method sends a request to the endpoint `/files/private/getAllRoutes` to fetch
     * the file system routes. It handles any errors that occur during the request and logs
     * them to the console. If the response contains an error, it logs the error message.
     * Otherwise, it updates the file system with the retrieved data.
     *
     * @returns {void}
     */
    updateFileSystem(): void {
        const request = this.http.get<GetAllRoutesApiResponse>("/files/private/getAllRoutes");

        request.pipe(
            catchError((error): any => {
                console.error(error);
                return error;
            }),
        );

        request.subscribe((response: GetAllRoutesApiResponse): void => {
            if (response.error) {
                console.error(response.message);
                return;
            }

            this.fileSystem.set(response.fileSystem as MetaFileSystem);
        });
    }

    /**
     * Retrieves all routes from the server.
     *
     * @returns {Observable<GetAllRoutesApiResponse>} An observable that emits the response containing all routes.
     *
     * @example
     * this.fileService.getAllRoutes().subscribe(
     *   (response) => {
     *     console.log(response);
     *   },
     *   (error) => {
     *     console.error(error);
     *   }
     * );
     */
    getAllRoutes(): Observable<GetAllRoutesApiResponse> {
        const request = this.http.get<GetAllRoutesApiResponse>("/files/private/getAllRoutes");

        request.pipe(
            catchError((error): any => {
                console.error(error);
                return error;
            }),
        );

        return request;
    }

    /**
     * Sets the current path in the file system and returns a display-friendly version of the path.
     *
     * @param {string} currentPath - The path to set in the file system.
     * @returns {string} The display-friendly version of the path.
     *
     * @throws Will log an error and return an empty string if the file system is null or if the path does not exist in the file system.
     */
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

        pathArray.forEach((path: string, index: number) => {
            if (index === 0) {
                displayPath += "root";
            } else {
                const tempPath = pathArray.slice(0, index + 1).join("/");
                displayPath += `/${fileSystem[tempPath].name}`;
            }
        });

        return displayPath;
    }

    /**
     * Retrieves the current path from the URL search parameters.
     * If the "path" parameter is not present, is null, or does not start with "root",
     * the method navigates to the "/files" route with "root" as the query parameter and returns "root".
     *
     * @returns {string} The current path from the URL search parameters or "root" if the path is invalid.
     */
    getCurrentPath(): string {
        const searchParams = new URLSearchParams(window.location.search);

        if (!searchParams.has("path") || searchParams.get("path") === null || !searchParams.get("path")?.startsWith("root")) {
            this.router.navigate(["/files"], { queryParams: { path: "root" } });
            return "root";
        }

        return searchParams.get("path") as string;
    }

    /**
     * Creates a new folder at the current path.
     *
     * @param {string} folderName - The name of the folder to be created.
     * @returns {Observable<ApiResponse>} An Observable of ApiResponse indicating the result of the folder creation.
     *
     * @example
     * ```typescript
     * this.fileService.createFolder('newFolder').subscribe(response => {
     *   console.log('Folder created successfully', response);
     * }, error => {
     *   console.error('Error creating folder', error);
     * });
     * ```
     */
    createFolder(folderName: string): Observable<ApiResponse> {
        const currentPath = this.getCurrentPath();

        const request = this.http.post<ApiResponse>("/api/private/createFolder", {
            name: folderName,
            path: currentPath,
        });

        request.pipe(
            catchError((error): any => {
                console.error(error);
                return error;
            }),
        );

        return request;
    }

    /**
     * Downloads a file from the server.
     *
     * @param {string} fileName - The name of the file to be downloaded.
     * @returns {Observable<Blob>} An Observable that emits the file as a Blob.
     *
     * @example
     * ```typescript
     * this.fileService.downloadFile('example.txt').subscribe((blob) => {
     *   // Handle the downloaded file blob
     * });
     * ```
     */
    downloadFile(fileName: string): Observable<Blob> {
        const request = this.http.get(`/files/private/file/${fileName}`, {
            responseType: "blob",
        });

        request.pipe(
            catchError((error): any => {
                console.error(error);
                return error;
            }),
        );

        return request;
    }
}
