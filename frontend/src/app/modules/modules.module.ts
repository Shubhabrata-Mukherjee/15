import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubmodulesModule } from '../submodules/submodules.module';
import {Form26asComponent} from './form26as/form26as.component';
import {Form15ghComponent} from './form15gh/form15gh.component';
import {ChallanComponent} from './challan/challan.component';
import {Certificate197Component} from './certificate197/certificate197.component';
import {ItrComponent} from './itr/itr.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/app.module.material.';
import { FormtdsComponent } from './formtds/formtds.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SubmodulesModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [
    Form26asComponent,
    Form15ghComponent,
    ChallanComponent,
    Certificate197Component,
    ItrComponent,
    FormtdsComponent
    
  ],
  exports: [
    Form26asComponent,
    Form15ghComponent,
    ChallanComponent,
    Certificate197Component,
    ItrComponent,
    FormtdsComponent
  ]
})
export class ModulesModule { }
