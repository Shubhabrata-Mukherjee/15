import { Routes } from '@angular/router';


import { Form15ghComponent } from '../../modules/form15gh/form15gh.component';
import { ChallanComponent } from '../../modules/challan/challan.component';
import { Certificate197Component } from '../../modules/certificate197/certificate197.component';
import { ItrComponent } from '../../modules/itr/itr.component';
import { FormtdsComponent } from '../../modules/formtds/formtds.component';

export const ITDLayoutRoutes: Routes = [
    // { path: '/Bank', redirectTo: '/form26as', component: Form26asComponent },    
    { path: 'form15gh',   component: Form15ghComponent },
    { path: 'formTDS',   component: FormtdsComponent },
    { path: 'challan',     component: ChallanComponent },
    { path: '197certificate',     component: Certificate197Component },
    { path: 'itr',          component: ItrComponent },
];
