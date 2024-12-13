import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { timonjs_message } from "timonjs";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss"
})
export class AppComponent implements OnInit {
    title = "portfolio";

    ngOnInit(): void {
        timonjs_message();
    }
}
