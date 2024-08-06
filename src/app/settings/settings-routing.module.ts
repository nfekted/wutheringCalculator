import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { provideTranslocoScope } from '@ngneat/transloco';

const routes: Routes = [
  { path: '', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [provideTranslocoScope({ scope: 'settings', alias: 's' })]
})
export class SettingsRoutingModule { }
