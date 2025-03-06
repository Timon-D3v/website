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

    private http = inject(HttpClient);

    /**
     * Constructor for the DisplayTextFileComponent.
     *
     * Initializes the component by calling the `open` method and setting the `isVisible` property to true.
     *
     * @remarks
     * The `effect` function is used to ensure that the `open` method is called and the `isVisible` property is set
     * whenever the component is instantiated.
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
     * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
     * This method is used to make an HTTP GET request to fetch the content of a text file and set it to the component's text property.
     *
     * The file path is constructed using the file name obtained from the `file` method.
     * The HTTP request is made with a response type of text.
     * Once the request is successful, the response text is set to the component's text property.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        const request = this.http.get("/files/private/file/" + this.file()?.fileName, { responseType: "text" });

        request.subscribe((text: string): void => {
            this.text.set(text);
        });
    }

    /**
     * Closes the display text file component by setting its visibility to false.
     *
     * @returns {void}
     */
    close(): void {
        this.isVisible.set(false);
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
