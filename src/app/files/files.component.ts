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
import { MetaData, MetaFile, MetaFolder } from "../../@types/metaData.type";
import { FolderComponent } from "./folder/folder.component";
import { FileComponent } from "./file/file.component";

@Component({
    selector: "app-files",
    imports: [BreadcrumbComponent, UploadComponent, CreateFolderComponent, FolderComponent, FileComponent],
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
    folderArray = signal<MetaFolder[]>([]);
    fileArray = signal<MetaData[]>([]);
    folderUrlArray = signal<string[]>([]);

    constructor() {
        effect(() => {
            console.info(this.fileService.fileSystem());

            this.siteTitleService.setTitleForRoute(this.router.url);

            const displayPath = this.fileService.setPath(this.currentPath());
            this.displayPathToBreadcrumb(displayPath);

            this.updateFolderArray();
            this.updateFileArray();
            this.updateFolderUrlArray();
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
        this.currentPath.set(this.fileService.getCurrentPath());

        this.fileService.updateFileSystem();

        const displayPath = this.fileService.setPath(this.currentPath());
        this.displayPathToBreadcrumb(displayPath);

        this.updateFolderArray();
        this.updateFileArray();
        this.updateFolderUrlArray();
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

    updateFolderArray(): void {
        const fileSystem = this.fileService.fileSystem();

        if (fileSystem === null) return;

        const currentFolder = this.fileService.fileSystem()?.[this.currentPath()];

        if (currentFolder === undefined) return;

        this.folderArray.set([]);

        currentFolder.folders.forEach((folder) => {
            this.folderArray.update((oldArray): MetaFolder[] => {
                oldArray.push(fileSystem[folder]);

                return oldArray;
            });
        });
    }

    updateFileArray(): void {
        const fileSystem = this.fileService.fileSystem();

        if (fileSystem === null) return;

        const currentFolder = this.fileService.fileSystem()?.[this.currentPath()];

        if (currentFolder === undefined) return;

        this.fileArray.set(currentFolder.files);
    }

    updateFolderUrlArray(): void {
        const fileSystem = this.fileService.fileSystem();

        if (fileSystem === null) return;

        const currentFolder = this.fileService.fileSystem()?.[this.currentPath()];

        if (currentFolder === undefined) return;

        this.folderUrlArray.set(currentFolder.folders);
    }
}
