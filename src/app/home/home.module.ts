import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TranslocoModule, provideTranslocoScope } from '@ngneat/transloco';
import { CharacterModule } from '../character/character.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TranslocoModule,
    CharacterModule
  ],
  providers: [provideTranslocoScope('home')]
})
export class HomeModule { }
