import { Component, input, OnInit } from "@angular/core";
import publicConfig from "../../../public.config";
import { SocialsIconInfo } from "../../../@types/socialsIconInfo.type";

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

    ngOnInit() {
        this.social = publicConfig.SOCIALS.ICONS[this.type()];
    }
}