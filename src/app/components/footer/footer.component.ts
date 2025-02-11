import { isPlatformBrowser } from "@angular/common";
import { Component, inject, Inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { FooterElementComponent } from "../footer-element/footer-element.component";
import publicConfig from "../../../public.config";
import { RouterLink } from "@angular/router";
import { SocialsIconComponent } from "../socials-icon/socials-icon.component";

@Component({
    selector: "app-footer",
    imports: [FooterElementComponent, RouterLink, SocialsIconComponent],
    templateUrl: "./footer.component.html",
    styleUrl: "./footer.component.scss",
})
export class FooterComponent implements OnInit {
    platformId = inject(PLATFORM_ID);

    screenWith = signal(0);
    currentX = signal(0);
    maxHeight = signal(0);
    clipPathStart = "polygon(0 0, 100% 0, 100% ";
    styleElement: HTMLStyleElement | null = null;
    appName = publicConfig.NAME;
    appEmail = publicConfig.EMAIL;
    copyRight = publicConfig.COPYRIGHT;

    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     * Initializes the component by setting up event listeners and manipulating the DOM.
     *
     * - Creates a style element and appends it to the footer element.
     * - Sets the initial screen width and updates it on window resize.
     * - Tracks mouse movements to update the current X position, clip box path, and gradient rotation.
     * - Retrieves and sets the maximum height of the footer's pseudo-element.
     *
     * This method only runs in a browser environment.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.styleElement = document.createElement("style");

        this.screenWith.set(window.innerWidth);

        window.addEventListener("resize", () => {
            this.screenWith.set(window.innerWidth);
        });

        window.addEventListener("mousemove", (event) => {
            this.currentX.set(event.clientX);
            this.clipBoxPath();
            this.setGradientRotation();
        });

        const footer = document.querySelector("footer");

        if (footer) {
            const pseudo = window.getComputedStyle(footer, ":before");
            this.maxHeight.set(Number(pseudo.height.replace("px", "")));

            footer.appendChild(this.styleElement);
        }
    }

    /**
     * Adjusts the gradient rotation of the footer element based on the current X position of the cursor.
     * The rotation is calculated using an exponential easing function to provide a smooth transition.
     *
     * The rotation angle is determined by a base value and an offset that is influenced by the cursor's
     * X position as a percentage of the screen width.
     *
     * The calculated rotation angle is then applied to the CSS custom property `--angle` of the footer element.
     *
     * This method should only be executed in a browser environment.
     *
     * @returns {void}
     */
    setGradientRotation(): void {
        const base = 200;
        const offset = 40;

        let percentage = this.currentX() / this.screenWith();
        percentage = this.exponentialEase(percentage, 1.5);

        const rotation = base - offset * percentage;

        if (isPlatformBrowser(this.platformId)) {
            const footer = document.querySelector("footer");

            if (footer) {
                footer.style.setProperty("--angle", `${rotation}deg`);
            }
        }
    }

    /**
     * Determines if the mouse cursor is on the left side of the screen.
     *
     * @returns {boolean} True if the mouse cursor is on the left side of the screen, false otherwise.
     */
    isMouseLeft(): boolean {
        return this.currentX() < this.screenWith() / 2;
    }

    /**
     * Calculates the height of a triangle given an angle.
     *
     * This function computes the height of a right triangle based on the provided angle.
     * It uses the screen width as the base of the triangle.
     *
     * @param {number} angle - The angle in degrees.
     * @returns {number} - The height of the triangle.
     */
    triangleHeight(angle: number): number {
        return (this.screenWith() / Math.cos(this.degreeToRadian(angle))) * Math.sin(this.degreeToRadian(angle));
    }

    /**
     * Converts an angle from degrees to radians.
     *
     * @param {number} degree - The angle in degrees to be converted.
     * @returns {number} The angle in radians.
     */
    degreeToRadian(degree: number): number {
        return (degree * Math.PI) / 180;
    }

    /**
     * Calculates the maximum angle in degrees that can be formed between the screen width and the hypotenuse
     * of a right triangle where the other side is the maximum height.
     *
     * @returns {number} The maximum angle in degrees.
     */
    maxAngle(): number {
        const hypotenuse = Math.sqrt(Math.pow(this.screenWith(), 2) + Math.pow(this.maxHeight(), 2));
        const scale = this.screenWith() / hypotenuse;
        const rad = Math.acos(scale);
        return (rad * 180) / Math.PI;
    }

    /**
     * Applies an exponential easing function to the given value.
     *
     * @param {number} value - The input value to be eased.
     * @param {number} power - The exponent to which the value will be raised.
     * @returns {number} The eased value, calculated as `value` raised to the power of `power`.
     */
    exponentialEase(value: number, power: number): number {
        return Math.pow(value, power);
    }

    /**
     * Applies a reverse exponential easing function to the given value.
     *
     * @param {number} value - The input value to be eased, typically between 0 and 1.
     * @param {number} power - The exponent used to control the easing curve.
     * @returns {number} The eased value, which is also between 0 and 1.
     */
    reverseExponentialEase(value: number, power: number): number {
        return 1 - Math.pow(1 - value, power);
    }

    /**
     * Adjusts the clip-path of the footer element based on the current mouse position.
     *
     * This method calculates the percentage of the distance from the center of the screen
     * to the current mouse position, applies a reverse exponential easing function to it,
     * and then uses this value to determine the angle and height of a triangular clip-path.
     * The clip-path is then applied to the footer element's ::before pseudo-element.
     *
     * @returns {void}
     */
    clipBoxPath(): void {
        const isLeft = this.isMouseLeft();
        const pxFromCenter = isLeft ? this.screenWith() / 2 - this.currentX() : this.currentX() - this.screenWith() / 2;

        let percentage = pxFromCenter / (this.screenWith() / 2);
        percentage = this.reverseExponentialEase(percentage, 2);

        const angle = percentage * this.maxAngle();
        const height = this.triangleHeight(angle);
        const clipPercentage = ((this.maxHeight() - height) / this.maxHeight()) * 100;

        if (isPlatformBrowser(this.platformId)) {
            let clipPath = this.clipPathStart;

            if (isLeft) clipPath += `${clipPercentage}%, 0% 100%)`;
            else clipPath += `100%, 0% ${clipPercentage}%)`;

            if (this.styleElement !== null) {
                this.styleElement.innerHTML = `footer::before {
                    clip-path: ${clipPath};
                    transform: translateY(${-clipPercentage / 2}px);
                }`;
            }
        }
    }
}
