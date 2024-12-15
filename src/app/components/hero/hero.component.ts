import { Component } from "@angular/core";
import { GradientTextComponent } from "../gradient-text/gradient-text.component";
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { SecondaryButtonComponent } from "../secondary-button/secondary-button.component";
import { HeroDotsComponent } from "../hero-dots/hero-dots.component";
import { HeroPopupComponent } from "../hero-popup/hero-popup.component";

@Component({
    selector: "app-hero",
    imports: [GradientTextComponent, PrimaryButtonComponent, SecondaryButtonComponent, HeroDotsComponent, HeroPopupComponent],
    templateUrl: "./hero.component.html",
    styleUrl: "./hero.component.scss",
})
export class HeroComponent {}
