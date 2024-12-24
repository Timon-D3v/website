import { Component } from '@angular/core';
import { PrimaryButtonComponent } from "../primary-button/primary-button.component";
import { SecondaryButtonComponent } from "../secondary-button/secondary-button.component";

@Component({
  selector: 'app-home-cta',
  imports: [PrimaryButtonComponent, SecondaryButtonComponent],
  templateUrl: './home-cta.component.html',
  styleUrl: './home-cta.component.scss'
})
export class HomeCtaComponent {

}
