import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoPipe, provideTranslocoScope } from '@jsverse/transloco';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslocoPipe],
    providers: [provideTranslocoScope('faq')]
})
export class FaqComponent {

  questions = [false, false, false, false, false, false, false, false, false];

}
