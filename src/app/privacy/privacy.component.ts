import { Component } from '@angular/core';
import publicConfig from '../../public.config';

@Component({
  selector: 'app-privacy',
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {
email = publicConfig.EMAIL
}
