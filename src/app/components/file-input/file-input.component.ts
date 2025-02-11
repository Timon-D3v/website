import { Component, input } from "@angular/core";

@Component({
    selector: "app-file-input",
    imports: [],
    templateUrl: "./file-input.component.html",
    styleUrl: "./file-input.component.scss",
})
export class FileInputComponent {
    for = input("");
    text = input("");
    title = input("");
    valid = input<number | boolean>(2);
    src = input("/svg/cloud.svg");
    fileName = input("");
}
