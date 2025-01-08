import { Injectable } from "@angular/core";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

@Injectable({
    providedIn: "root",
})
export class GsapService {
    /**
     * Initializes the GSAP service by registering the ScrollTrigger plugin.
     * This method should be called to set up any necessary GSAP plugins before using them.
     * @returns {void}
     */
    init(): void {
        gsap.registerPlugin(ScrollTrigger);
    }
}
