import { Component, ChangeDetectionStrategy } from '@angular/core';
import { provideTranslocoScope } from '@ngneat/transloco';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FaqComponent {

  questions = [false, false, false, false, false, false, false, false, false];

}
