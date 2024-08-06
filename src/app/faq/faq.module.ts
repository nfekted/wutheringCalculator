import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { TranslocoModule, provideTranslocoScope } from '@ngneat/transloco';
import { FaqComponent } from './faq.component';


@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    FaqRoutingModule,
    TranslocoModule
  ],
  providers: [provideTranslocoScope('faq')]
})
export class FaqModule { }
