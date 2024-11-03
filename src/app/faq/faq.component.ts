import { Component } from '@angular/core';
import { provideTranslocoScope } from '@ngneat/transloco';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {

  questions = [false, false, false, false, false, false, false, false, false];

}
