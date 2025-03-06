import { Component, effect, inject, input, PLATFORM_ID, signal } from "@angular/core";
import { MetaData } from "../../../@types/metaData.type";
import { randomString } from "timonjs";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-display-video-file",
    imports: [],
    templateUrl: "./display-video-file.component.html",
    styleUrl: "./display-video-file.component.scss",
})
export class DisplayVideoFileComponent {
    file = input<MetaData | null>(null);
    open = input(0);

    isVisible = signal(false);

    id = randomString(11);

    private platformId = inject(PLATFORM_ID);

    /**
     * Initializes the DisplayVideoFileComponent.
     *
     * The constructor sets up an effect that performs the following actions:
     * - Calls the `open` method to initialize or open the video file.
     * - Sets the `isVisible` property to `true` to indicate that the video file is visible.
     *
     * @constructor
     */
    constructor() {
        effect((): void => {
            if (this.open() === 0) return;

            this.isVisible.set(true);
        });
    }

    /**
     * Closes the video display by setting its visibility to false.
     * If the platform is a browser, it pauses the video element with the given ID.
     *
     * @returns {void}
     */
    close(): void {
        this.isVisible.set(false);

        if (!isPlatformBrowser(this.platformId)) return;

        const video = document.getElementById(this.id) as HTMLVideoElement;

        video?.pause();
    }

    /**
     * Stops the propagation of the given event.
     *
     * This method prevents the event from bubbling up the DOM tree,
     * preventing any parent handlers from being notified of the event.
     *
     * @param {Event} event - The event whose propagation is to be stopped.
     * @returns {void}
     */
    stopPropagation(event: Event): void {
        event.stopPropagation();
    }
}
