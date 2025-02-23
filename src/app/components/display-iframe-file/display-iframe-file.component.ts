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

    sanitizer = inject(DomSanitizer);
    
    constructor() {
        effect(() => {
            this.open();
            this.isVisible.set(true);

            this.secureRoute.set(this.getSafeUrl());
        });
    }

    close() {
        this.isVisible.set(false);
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }

    getSafeUrl(): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl('/files/private/file/' + this.file()?.fileName);
    }
}

