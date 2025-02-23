import { Component, effect, inject, input, signal } from "@angular/core";
import { MetaData } from "../../../@types/metaData.type";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: "app-display-iframe-file",
    imports: [],
    templateUrl: "./display-iframe-file.component.html",
    styleUrl: "./display-iframe-file.component.scss",
})
export class DisplayIframeFileComponent {
    file = input<MetaData | null>(null);
    open = input(0);

    isVisible = signal(false);
    secureRoute = signal<SafeResourceUrl>("");

    private sanitizer = inject(DomSanitizer);

    /**
     * Constructor for the DisplayIframeFileComponent.
     *
     * Initializes the component by setting up an effect that:
     * - Opens the iframe.
     * - Sets the visibility of the iframe to true.
     * - Sets a secure route for the iframe using a safe URL.
     *
     * @constructor
     */
    constructor() {
        effect((): void => {
            this.open();
            this.isVisible.set(true);

            this.secureRoute.set(this.getSafeUrl());
        });
    }

    /**
     * Closes the iframe display by setting the visibility to false.
     *
     * @returns {void}
     */
    close(): void {
        this.isVisible.set(false);
    }

    /**
     * Stops the propagation of the given event.
     *
     * @param {Event} event - The event whose propagation should be stopped.
     * @returns {void}
     */
    stopPropagation(event: Event): void {
        event.stopPropagation();
    }

    /**
     * Generates a safe URL for embedding an iframe.
     *
     * This method uses Angular's DomSanitizer to bypass security and trust the constructed URL.
     * The URL is constructed by appending the file name to a base path.
     *
     * @returns {SafeResourceUrl} A safe URL that can be used in an iframe.
     */
    getSafeUrl(): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl("/files/private/file/" + this.file()?.fileName);
    }
}
