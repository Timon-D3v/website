import { Component } from "@angular/core";
import publicConfig from "../../public.config";

@Component({
    selector: "app-imprint",
    imports: [],
    templateUrl: "./imprint.component.html",
    styleUrl: "./imprint.component.scss",
})
export class ImprintComponent {
    email = publicConfig.EMAIL;
}
