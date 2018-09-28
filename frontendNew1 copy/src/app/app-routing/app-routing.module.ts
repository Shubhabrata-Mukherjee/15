import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from '../login/login.component';
import{ Bank1Component} from '../bank1/bank1.component';
 import{Bank2Component} from '../bank2/bank2.component';
//import { Bank2Component } from '../bank2/bank2.component';
import{ ItdComponent} from '../itd/itd.component';
import{ BankLayoutComponent} from '../layouts/bank-layout/bank-layout.component';
import{ ItdLayoutComponent } from '../layouts/itd-layout/itd-layout.component';
import { CommonModule, } from '@angular/common';
//import { BrowserModule  } from '@angular/platform-browser';


const appRoutes: Routes = [
  
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'Bank',
        component: BankLayoutComponent,
        children: [
            {
          path: '',
          loadChildren: '../layouts/bank-layout/bank-layout.module#BankLayoutModule'
      }]},
      {
        path: 'ITD',
        component: ItdLayoutComponent,
        children: [
            {
          path: '',
          loadChildren: '../layouts/itd-layout/itd-layout.module#ITDLayoutModule'
      }]},
    { path:'login',component:LoginComponent},
    { path:'bank1',component:Bank1Component},
    { path:'bank2',component:Bank2Component},
    { path:'itd',component:ItdComponent},
    
];

@NgModule({
    imports: [
        CommonModule,
        //BrowserModule,
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }