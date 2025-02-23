import { Component, effect, inject, input, OnInit, signal } from "@angular/core";
import { MetaData } from "../../../@types/metaData.type";
import { randomString } from "timonjs";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "app-display-text-file",
    imports: [],
    templateUrl: "./display-text-file.component.html",
    styleUrl: "./display-text-file.component.scss",
})
export class DisplayTextFileComponent implements OnInit {
    file = input<MetaData | null>(null);
    open = input(0);

    isVisible = signal(false);
    text = signal("");

    id = randomString(14);

    http = inject(HttpClient);

    constructor() {
        effect(() => {
            this.open();
            this.isVisible.set(true);
        });
    }

    ngOnInit() {
        const request = this.http.get("/files/private/file/" + this.file()?.fileName, { responseType: "text" });

        request.subscribe((text) => {
            this.text.set(text);
        });
    }

    close() {
        this.isVisible.set(false);
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}

