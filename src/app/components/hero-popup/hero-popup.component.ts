import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-popup',
  imports: [],
  templateUrl: './hero-popup.component.html',
  styleUrl: './hero-popup.component.scss'
})
export class HeroPopupComponent {
  text = input("");
  title = input("");
  iconUrl = input("");
}
