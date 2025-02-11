import { Component, inject, input, OnInit, PLATFORM_ID } from "@angular/core";
import publicConfig from "../../../public.config";
import { SocialsIconInfo } from "../../../@types/socialsIconInfo.type";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-socials-icon",
    imports: [],
    templateUrl: "./socials-icon.component.html",
    styleUrl: "./socials-icon.component.scss",
})
export class SocialsIconComponent implements OnInit {
    theme = input("black");
    type = input("LinkedIn");
    social: SocialsIconInfo = publicConfig.SOCIALS.ICONS[this.type()];

    platformId = inject(PLATFORM_ID);

    /**
     * Lifecycle hook that is called after data-bound properties of a directive are initialized.
     * Initializes the social icon based on the type provided.
     *
     * @returns {void}
     */
    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        this.social = publicConfig.SOCIALS.ICONS[this.type()];
    }
}
