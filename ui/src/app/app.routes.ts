import { Routes } from '@angular/router';
import { StagesViewComponent } from '@app/work-spaces/stages-view/stages-view.component';
import {GlobalsViewComponent} from "@app/work-spaces/globals-view/globals-view.component";

export const routes: Routes = [
  {
    path: 'stages',
    component: StagesViewComponent,
  },
  {
    path: 'globals',
    component: GlobalsViewComponent,
  },
];
