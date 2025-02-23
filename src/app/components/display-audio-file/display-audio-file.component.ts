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

        const audio = document.getElementById(this.id) as HTMLAudioElement;

        audio?.pause();
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}

