import { Component } from "@angular/core";
import { AboutMeCanvasComponent } from "../about-me-canvas/about-me-canvas.component";
import { GradientTextComponent } from "../gradient-text/gradient-text.component";
import { SocialsIconComponent } from "../socials-icon/socials-icon.component";
import publicConfig from "../../../public.config";

@Component({
    selector: "app-about-me",
    imports: [AboutMeCanvasComponent, GradientTextComponent, SocialsIconComponent],
    templateUrl: "./about-me.component.html",
    styleUrl: "./about-me.component.scss",
})
export class AboutMeComponent {
    text = publicConfig.TEMPLATES.ABOUT_ME_TEXT;
}
