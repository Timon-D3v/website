import { Component, input } from "@angular/core";
import { BreadcrumbItem } from "../../../@types/breadcrumb.type";
import { BreadcrumbItemComponent } from "../breadcrumb-item/breadcrumb-item.component";
import { BreadcrumbSeparatorComponent } from "../breadcrumb-separator/breadcrumb-separator.component";

@Component({
    selector: "app-breadcrumb",
    imports: [BreadcrumbItemComponent, BreadcrumbSeparatorComponent],
    templateUrl: "./breadcrumb.component.html",
    styleUrl: "./breadcrumb.component.scss",
})
export class BreadcrumbComponent {
    children = input<BreadcrumbItem[]>([]);
}
