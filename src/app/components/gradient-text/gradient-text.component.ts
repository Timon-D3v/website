import { Component, input } from '@angular/core';

@Component({
  selector: 'app-gradient-text',
  imports: [],
  templateUrl: './gradient-text.component.html',
  styleUrl: './gradient-text.component.scss'
})
export class GradientTextComponent {

  text = input("");
  color1 = input("");
  color2 = input("");
  angle = input("");
}
