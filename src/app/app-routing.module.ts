import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeModule } from './home/home.module';
import { FaqModule } from './faq/faq.module';
import { PartnersModule } from './partners/partners.module';

const routes: Routes = [
  { path: '', loadChildren: () => HomeModule },
  { path: 'faq', loadChildren: () => FaqModule },
  { path: 'partners', loadChildren: () => PartnersModule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
