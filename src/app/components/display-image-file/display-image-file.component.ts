import { Component, effect, input, signal } from "@angular/core";
import { MetaData } from "../../../@types/metaData.type";

@Component({
    selector: "app-display-image-file",
    imports: [],
    templateUrl: "./display-image-file.component.html",
    styleUrl: "./display-image-file.component.scss",
})
export class DisplayImageFileComponent {
    file = input<MetaData | null>(null);
    open = input(0);

    isVisible = signal(false);
    
    constructor() {
        effect(() => {
            this.open();
            this.isVisible.set(true);
        });
    }

    close() {
        this.isVisible.set(false);
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
