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

    /**
     * Initializes the FilesComponent.
     *
     * The constructor sets up an effect that:
     * - Logs the current file system state using the fileService.
     * - Sets the site title based on the current route using the siteTitleService.
     * - Updates the display path and converts it to a breadcrumb format.
     * - Updates the folder array, file array, and folder URL array.
     *
     * @constructor
     */
    constructor() {
        effect((): void => {
            console.info(this.fileService.fileSystem());

            this.siteTitleService.setTitleForRoute(this.router.url);

            const displayPath = this.fileService.setPath(this.currentPath());
            this.displayPathToBreadcrumb(displayPath);

            this.updateFolderArray();
            this.updateFileArray();
            this.updateFolderUrlArray();
        });
    }

    /**
     * Angular lifecycle hook that is called after the component's view has been fully initialized.
     *
     * This method performs the following actions:
     * 1. Checks if the platform is a server. If true, it returns early.
     * 2. Calls the `init` method to perform initial setup.
     * 3. Subscribes to the router's `NavigationEnd` events to reinitialize the component
     *    every time the route changes.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        if (isPlatformServer(this.platformId)) return;

        this.init();

        const navigationEndPipe = this.router.events.pipe(filter((event): boolean => event instanceof NavigationEnd));

        navigationEndPipe.subscribe((): void => {
            // The part below is called every time the route changes.
            this.init();
        });
    }

    /**
     * Initializes the file component by setting the current path, updating the file system,
     * and updating the display path, folder array, file array, and folder URL array.
     *
     * @returns {void}
     */
    init(): void {
        this.currentPath.set(this.fileService.getCurrentPath());

        this.fileService.updateFileSystem();

        const displayPath = this.fileService.setPath(this.currentPath());
        this.displayPathToBreadcrumb(displayPath);

        this.updateFolderArray();
        this.updateFileArray();
        this.updateFolderUrlArray();
    }

    /**
     * Converts a given file path into a breadcrumb array and updates the breadcrumbPathArray.
     * Each breadcrumb item represents a part of the path with its name, URL, and flags indicating
     * if it is the root or the last item in the path.
     *
     * @param {string} path - The file path to be converted into breadcrumb items.
     * @returns {void}
     */
    displayPathToBreadcrumb(path: string): void {
        const pathArray = path.split("/");

        this.breadcrumbPathArray.set([]);

        for (let i = 0; i < pathArray.length; i++) {
            this.breadcrumbPathArray.update((oldArray: BreadcrumbItem[]): BreadcrumbItem[] => {
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

    /**
     * Updates the folderArray with the folders from the current path in the file system.
     *
     * This method retrieves the file system from the fileService and checks if it is not null.
     * It then gets the current folder based on the current path. If the current folder is undefined,
     * the method returns early.
     *
     * The folderArray is reset to an empty array, and then each folder in the current folder is added
     * to the folderArray by updating it with the corresponding folder from the file system.
     *
     * @returns {void}
     */
    updateFolderArray(): void {
        const fileSystem = this.fileService.fileSystem();

        if (fileSystem === null) return;

        const currentFolder = this.fileService.fileSystem()?.[this.currentPath()];

        if (currentFolder === undefined) return;

        this.folderArray.set([]);

        currentFolder.folders.forEach((folder: string): void => {
            this.folderArray.update((oldArray: MetaFolder[]): MetaFolder[] => {
                oldArray.push(fileSystem[folder]);

                return oldArray;
            });
        });
    }

    /**
     * Updates the file array with the files from the current folder in the file system.
     *
     * This method retrieves the file system from the file service. If the file system is null,
     * the method returns early. It then gets the current folder based on the current path.
     * If the current folder is undefined, the method returns early. Finally, it sets the
     * file array with the files from the current folder.
     *
     * @returns {void}
     */
    updateFileArray(): void {
        const fileSystem = this.fileService.fileSystem();

        if (fileSystem === null) return;

        const currentFolder = this.fileService.fileSystem()?.[this.currentPath()];

        if (currentFolder === undefined) return;

        this.fileArray.set(currentFolder.files);
    }

    /**
     * Updates the folder URL array with the folders from the current path in the file system.
     *
     * This method retrieves the file system from the file service. If the file system is null,
     * the method returns early. It then gets the current folder from the file system using the
     * current path. If the current folder is undefined, the method returns early. Finally, it
     * sets the folder URL array with the folders from the current folder.
     *
     * @returns {void}
     */
    updateFolderUrlArray(): void {
        const fileSystem = this.fileService.fileSystem();

        if (fileSystem === null) return;

        const currentFolder = this.fileService.fileSystem()?.[this.currentPath()];

        if (currentFolder === undefined) return;

        this.folderUrlArray.set(currentFolder.folders);
    }
}
