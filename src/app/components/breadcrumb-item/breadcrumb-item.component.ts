import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-breadcrumb-item",
    imports: [RouterLink],
    templateUrl: "./breadcrumb-item.component.html",
    styleUrl: "./breadcrumb-item.component.scss",
})
export class BreadcrumbItemComponent {
    name = input("");
    url = input("");
    isRoot = input(false);
    isLastItem = input(false);
}
