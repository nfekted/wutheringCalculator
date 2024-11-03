import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnersRoutingModule } from './partners-routing.module';
import { TranslocoModule, provideTranslocoScope } from '@ngneat/transloco';
import { PartnersComponent } from './partners.component';


@NgModule({
  declarations: [PartnersComponent],
  imports: [
    CommonModule,
    PartnersRoutingModule,
    TranslocoModule
  ],
  providers: [provideTranslocoScope('partners')]
})
export class PartnersModule { }
