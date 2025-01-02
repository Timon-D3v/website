import { Component, input, signal } from "@angular/core";
import { gsap } from "gsap";
import { randomString } from "timonjs";

@Component({
    selector: "app-project",
    imports: [],
    templateUrl: "./project.component.html",
    styleUrl: "./project.component.scss",
})
export class ProjectComponent {
    description = input("Description");
    image = input("https://via.placeholder.com/150");
    id = input(0);
    title = input("Title");
    url = input("#");
    wrapperId = signal(randomString(64));

    evenOdd() {
        return this.id() % 2 === 0 ? "even" : "odd";
    }

    boxShadowEaseIn() {
        gsap.fromTo(
            document.getElementById(this.wrapperId()),
            {
                "--box-shadow-blur": "30px",
                "--box-shadow-spread": "2px",
            },
            {
                "--box-shadow-blur": "40px",
                "--box-shadow-spread": "10px",
                "duration": 0.5,
                "ease": "power2.inOut",
            },
        );
    }

    boxShadowEaseOut() {
        gsap.fromTo(
            document.getElementById(this.wrapperId()),
            {
                "--box-shadow-blur": "40px",
                "--box-shadow-spread": "10px",
            },
            {
                "--box-shadow-blur": "30px",
                "--box-shadow-spread": "2px",
                "duration": 0.5,
                "ease": "power2.inOut",
            },
        );
    }
}
