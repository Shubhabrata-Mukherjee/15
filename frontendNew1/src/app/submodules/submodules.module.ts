import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FetchPanDetailsComponent } from './fetch-pan-details/fetch-pan-details.component';
import { AddForm15ghComponent } from './add-form15gh/add-form15gh.component';
import { SearchPanComponent } from './search-pan/search-pan.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/app.module.material.';
import { CreateRuleComponent } from './create-rule/create-rule.component';
import { QueryRuleComponent } from './query-rule/query-rule.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule 
  ],
  declarations: [    
    FetchPanDetailsComponent,
    AddForm15ghComponent,
    SearchPanComponent,
    CreateRuleComponent,
    QueryRuleComponent
  ],
  exports: [
    FetchPanDetailsComponent,
    AddForm15ghComponent,
    SearchPanComponent,
    CreateRuleComponent,
    QueryRuleComponent
  ]
})
export class SubmodulesModule { }
