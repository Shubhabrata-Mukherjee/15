import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from '../login/login.component';
import{ Bank1Component} from '../bank1/bank1.component';
 import{Bank2Component} from '../bank2/bank2.component';
//import { Bank2Component } from '../bank2/bank2.component';
import{ ItdComponent} from '../itd/itd.component';



const appRoutes: Routes = [
  
    { path: '', redirectTo: '/login', pathMatch: 'full' },
   
    { path:'login',component:LoginComponent},
    { path:'bank1',component:Bank1Component},
    { path:'bank2',component:Bank2Component},
    { path:'itd',component:ItdComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }