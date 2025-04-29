import { Component, input } from "@angular/core";

@Component({
    selector: "app-footer-element",
    imports: [],
    templateUrl: "./footer-element.component.html",
    styleUrl: "./footer-element.component.scss",
})
export class FooterElementComponent {
    text = input("");
    title = input("");
    bold = input(false);
    href = input("");
}
