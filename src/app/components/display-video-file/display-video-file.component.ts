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

    platformId = inject(PLATFORM_ID);
    
    constructor() {
        effect(() => {
            this.open();
            this.isVisible.set(true);
        });
    }

    close() {
        this.isVisible.set(false);

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const video = document.getElementById(this.id) as HTMLVideoElement;

        video?.pause();
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}

