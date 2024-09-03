import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeModule } from './home/home.module';
import { FaqModule } from './faq/faq.module';

const routes: Routes = [
  { path: '', loadChildren: () => HomeModule },
  { path: 'faq', loadChildren: () => FaqModule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
