import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CharacterRoutingModule } from './character-routing.module';
import { TranslocoModule, provideTranslocoScope } from '@ngneat/transloco';
import { CharacterComponent } from './character.component';
import { FormsModule } from '@angular/forms';
import { AttributeModalComponent } from '../attribute-modal/attribute-modal.component';
import { EchoComparatorModalComponent } from '../echo-comparator/echo-comparator-modal.component';

@NgModule({
  declarations: [CharacterComponent, AttributeModalComponent, EchoComparatorModalComponent],
  imports: [
    CommonModule,
    CharacterRoutingModule,
    TranslocoModule,
    FormsModule
  ],
  exports: [CharacterComponent],
  providers: [provideTranslocoScope('char')]
})
export class CharacterModule { }
