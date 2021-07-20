import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountPage } from './count.page';

const routes: Routes = [
  {
    path: '',
    component: CountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountPageRoutingModule {}
