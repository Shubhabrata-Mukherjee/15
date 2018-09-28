import { Routes } from '@angular/router';

import { Form26asComponent } from '../../modules/form26as/form26as.component';
import { Form15ghComponent } from '../../modules/form15gh/form15gh.component';
import { ChallanComponent } from '../../modules/challan/challan.component';
import { Certificate197Component } from '../../modules/certificate197/certificate197.component';
import { ItrComponent } from '../../modules/itr/itr.component';

export const BankLayoutRoutes: Routes = [
    // { path: '/Bank', redirectTo: '/form26as', component: Form26asComponent },
    { path: 'form26as',      component: Form26asComponent },
    { path: 'form15gh',   component: Form15ghComponent },
    { path: 'challan',     component: ChallanComponent },
    { path: '197certificate',     component: Certificate197Component },
    { path: 'itr',          component: ItrComponent },
];
