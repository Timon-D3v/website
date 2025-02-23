import { Component, effect, inject, input, PLATFORM_ID, signal } from "@angular/core";
import { MetaData } from "../../../@types/metaData.type";
import { randomString } from "timonjs";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-display-audio-file",
    imports: [],
    templateUrl: "./display-audio-file.component.html",
    styleUrl: "./display-audio-file.component.scss",
})
export class DisplayAudioFileComponent {
    file = input<MetaData | null>(null);
    open = input(0);

    isVisible = signal(false);

    id = randomString(10);

    private platformId = inject(PLATFORM_ID);

    /**
     * Initializes the DisplayAudioFileComponent.
     *
     * The constructor sets up an effect that triggers the `open` method and sets the `isVisible` property to `true`.
     *
     * @constructor
     */
    constructor() {
        effect((): void => {
            this.open();
            this.isVisible.set(true);
        });
    }

    /**
     * Closes the audio player component.
     *
     * This method sets the visibility of the component to false and pauses the audio playback if the platform is a browser.
     *
     * @returns {void}
     */
    close(): void {
        this.isVisible.set(false);

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const audio = document.getElementById(this.id) as HTMLAudioElement;

        audio?.pause();
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
}
