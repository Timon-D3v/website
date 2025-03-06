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

    /**
     * Constructor for the DisplayImageFileComponent.
     *
     * Initializes the component by invoking the `open` method and setting the `isVisible` property to `true`.
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
     * Closes the display image file component by setting its visibility to false.
     *
     * @returns {void}
     */
    close(): void {
        this.isVisible.set(false);
    }

    /**
     * Prevents the event from propagating (bubbling) up the DOM tree.
     *
     * @param {Event} event - The event object that triggered the handler.
     * @returns {void}
     */
    stopPropagation(event: Event): void {
        event.stopPropagation();
    }
}
