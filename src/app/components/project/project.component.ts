import { Component, input, signal } from "@angular/core";
import { gsap } from "gsap";
import { randomString } from "timonjs";

@Component({
    selector: "app-project",
    imports: [],
    templateUrl: "./project.component.html",
    styleUrl: "./project.component.scss",
})
export class ProjectComponent {
    description = input("Description");
    image = input("#");
    portrait_image = input("#");
    id = input(0);
    title = input("Title");
    url = input("#");
    wrapperId = signal(randomString(64));

    /**
     * Determines if the project ID is even or odd.
     *
     * @returns {"even" | "odd"} "even" if the project ID is even, "odd" if the project ID is odd.
     */
    evenOdd(): "even" | "odd" {
        return this.id() % 2 === 0 ? "even" : "odd";
    }

    /**
     * Animates the box-shadow of the element with the ID returned by `this.wrapperId()`.
     * The animation transitions the box-shadow blur from 30px to 40px and the spread from 2px to 10px.
     * The animation duration is 0.5 seconds and uses the "power2.inOut" easing function.
     *
     * @remarks
     * This method uses the GSAP library to perform the animation.
     *
     * @returns {void}
     */
    boxShadowEaseIn(): void {
        gsap.fromTo(
            document.getElementById(this.wrapperId()),
            {
                "--box-shadow-blur": "30px",
                "--box-shadow-spread": "2px",
            },
            {
                "--box-shadow-blur": "40px",
                "--box-shadow-spread": "10px",
                "duration": 0.5,
                "ease": "power2.inOut",
            },
        );
    }

    /**
     * Animates the box-shadow of an element with a specified wrapper ID.
     * The animation transitions the box-shadow blur from 40px to 30px and the spread from 10px to 2px.
     * The animation duration is 0.5 seconds and uses the "power2.inOut" easing function.
     *
     * @remarks
     * This method uses the GSAP library to perform the animation.
     *
     * @example
     * ```typescript
     * this.boxShadowEaseOut();
     * ```
     *
     * @returns {void}
     */
    boxShadowEaseOut(): void {
        gsap.fromTo(
            document.getElementById(this.wrapperId()),
            {
                "--box-shadow-blur": "40px",
                "--box-shadow-spread": "10px",
            },
            {
                "--box-shadow-blur": "30px",
                "--box-shadow-spread": "2px",
                "duration": 0.5,
                "ease": "power2.inOut",
            },
        );
    }
}
