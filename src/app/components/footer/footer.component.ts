import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { FooterElementComponent } from "../footer-element/footer-element.component";
import publicConfig from "../../../public.config";
import { RouterLink } from "@angular/router";
import { SocialsIconComponent } from "../socials-icon/socials-icon.component";

@Component({
    selector: "app-footer",
    imports: [FooterElementComponent, RouterLink, SocialsIconComponent],
    templateUrl: "./footer.component.html",
    styleUrl: "./footer.component.scss"
})
export class FooterComponent implements OnInit {
    constructor(
        @Inject(PLATFORM_ID) private platformId: any
    ) {}

    screenWith = signal(0);
    currentX = signal(0);
    maxHeight = signal(0);
    clipPathStart = "polygon(0 0, 100% 0, 100% ";
    styleElement: HTMLStyleElement | null = null;
    appName = publicConfig.NAME;
    appEmail = publicConfig.EMAIL;
    copyRight = publicConfig.COPYRIGHT;


    ngOnInit() {

        if (isPlatformBrowser(this.platformId)) {
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
    }

    setGradientRotation() {
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

    isMouseLeft(): boolean {
        return this.currentX() < this.screenWith() / 2;
    }

    triangleHeight(angle: number): number {
        return (this.screenWith() / Math.cos(this.degreeToRadian(angle))) * Math.sin(this.degreeToRadian(angle));
    }

    degreeToRadian(degree: number): number {
        return degree * Math.PI / 180;
    }

    maxAngle(): number {
        const hypotenuse = Math.sqrt(Math.pow(this.screenWith(), 2) + Math.pow(this.maxHeight(), 2));
        const scale = this.screenWith() / hypotenuse;
        const rad = Math.acos(scale);
        return rad * 180 / Math.PI;
    }

    exponentialEase(value: number, power: number): number {
        return Math.pow(value, power);
    }

    reverseExponentialEase(value: number, power: number): number {
        return 1 - Math.pow(1 - value, power);
    }

    clipBoxPath() {
        const isLeft = this.isMouseLeft();
        const pxFromCenter = isLeft ? this.screenWith() / 2 - this.currentX() : this.currentX() - this.screenWith() / 2;
        
        let percentage = pxFromCenter / (this.screenWith() / 2);
        percentage = this.reverseExponentialEase(percentage, 2);

        const angle = percentage * this.maxAngle();
        const height = this.triangleHeight(angle);
        const clipPercentage = (this.maxHeight() - height) / this.maxHeight() * 100;

        if (isPlatformBrowser(this.platformId)) {
            let clipPath = this.clipPathStart
            
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
