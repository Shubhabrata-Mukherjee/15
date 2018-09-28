import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITDLayoutRoutes } from './itd-layout.routing';
import { ModulesModule} from '../../modules/modules.module';

import {
    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatTooltipModule,
  } from '@angular/material';
  @NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(ITDLayoutRoutes),
      FormsModule,
      MatButtonModule,
      MatRippleModule,
      MatInputModule,
      MatTooltipModule,
      ModulesModule
    ],
    declarations: [
    ]
  })
  
  export class ITDLayoutModule {}
  