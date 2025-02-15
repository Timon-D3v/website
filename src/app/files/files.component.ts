import { Component, effect, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { UploadComponent } from "../components/upload/upload.component";
import { CreateFolderComponent } from "../components/create-folder/create-folder.component";
import { FileService } from "../services/file.service";
import { isPlatformServer } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { SiteTitleService } from "../services/site-title.service";
import { BreadcrumbComponent } from "../components/breadcrumb/breadcrumb.component";
import { BreadcrumbItem } from "../../@types/breadcrumb.type";
import { filter } from "rxjs";

@Component({
    selector: "app-files",
    imports: [BreadcrumbComponent, UploadComponent, CreateFolderComponent],
    templateUrl: "./files.component.html",
    styleUrl: "./files.component.scss",
})
export class FilesComponent implements OnInit {
    private fileService = inject(FileService);
    private platformId = inject(PLATFORM_ID);
    private router = inject(Router);
    private siteTitleService = inject(SiteTitleService);

    searchParams: null | URLSearchParams = null;
    currentPath = signal("root");

    breadcrumbPathArray = signal<BreadcrumbItem[]>([]);

    constructor() {
        effect(() => {
            console.info(this.fileService.fileSystem());

            this.siteTitleService.setTitleForRoute(this.router.url);

            const displayPath = this.fileService.setPath(this.currentPath());
            this.displayPathToBreadcrumb(displayPath);
        });
    }

    ngOnInit(): void {
        if (isPlatformServer(this.platformId)) return;

        this.init();

        const navigationEndPipe = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));

        navigationEndPipe.subscribe(() => {
            // The part below is called every time the route changes.
            this.init();
        });
    }

    init(): void {
        this.searchParams = new URLSearchParams(window.location.search);

        if (!this.searchParams.has("path") || this.searchParams.get("path") === null || !this.searchParams.get("path")?.startsWith("root")) {
            this.router.navigate(["/files"], { queryParams: { path: "root" } });
        }

        this.currentPath.set(this.searchParams.get("path") as string);

        this.fileService.updateFileSystem();

        const displayPath = this.fileService.setPath(this.currentPath());
        this.displayPathToBreadcrumb(displayPath);
    }

    displayPathToBreadcrumb(path: string): void {
        const pathArray = path.split("/");

        this.breadcrumbPathArray.set([]);

        for (let i = 0; i < pathArray.length; i++) {
            this.breadcrumbPathArray.update((oldArray): BreadcrumbItem[] => {
                oldArray.push({
                    name: pathArray[i],
                    url:
                        "/files?path=" +
                        this.currentPath()
                            .split("/")
                            .slice(0, i + 1)
                            .join("/"),
                    isRoot: pathArray[i] === "root",
                    isLastItem: i === pathArray.length - 1,
                });

                return oldArray;
            });
        }
    }
}
