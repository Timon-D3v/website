import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { ExecuteResponse } from "../../@types/execute.type";
import publicConfig from "../../public.config";

@Injectable({
    providedIn: "root",
})
export class CmdService {
    private http = inject(HttpClient);

    execute(command: string): Observable<ExecuteResponse> {
        const request = this.http.post<ExecuteResponse>("/api/private/admin/execute", {
            command,
        });

        request.pipe(
            catchError((error): any => {
                console.error(error);
                return {
                    status: 400,
                    error: true,
                    result: publicConfig.ERRORS.NETWORK,
                };
            }),
        );

        return request;
    }

    getCurrentWorkingDirectory(): Observable<{ cwd: string }> {
        return this.http.get<{ cwd: string }>("/api/private/admin/executeDirectory", {
            responseType: "json",
        });
    }
}
