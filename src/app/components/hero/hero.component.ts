import { Component } from "@angular/core";
import { GradientTextComponent } from "../gradient-text/gradient-text.component";
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { SecondaryButtonComponent } from "../secondary-button/secondary-button.component";
import { HeroDotsComponent } from "../hero-dots/hero-dots.component";
import { scrollToQuery } from "timonjs";

@Component({
    selector: "app-hero",
    imports: [GradientTextComponent, PrimaryButtonComponent, SecondaryButtonComponent, HeroDotsComponent],
    templateUrl: "./hero.component.html",
    styleUrl: "./hero.component.scss",
})
export class HeroComponent {
    /**
     * Scrolls the page to the "About Me" section.
     * This method uses the `scrollToQuery` function to locate the element
     * with the tag name "app-about-me" and scrolls the page to its position.
     * 
     * @returns {void}
     */
    scrollToAbout(): void {
        scrollToQuery("app-about-me");
    }

    /**
     * Scrolls the page to the contact form component.
     * Utilizes the `scrollToQuery` function to locate the element with the query selector "app-contact-form"
     * and smoothly scrolls the viewport to it.
     * 
     * @returns {void}
     */
    scrollToContact(): void {
        scrollToQuery("app-contact-form");
    }
}
