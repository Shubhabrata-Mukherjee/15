//import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { Bank1Component } from './bank1/bank1.component';
import { Bank2Component } from './bank2/bank2.component';
import { ItdComponent } from './itd/itd.component';


import { HttpClientModule }     from '@angular/common/http';
import { HttpModule } from '@angular/http';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatButtonModule, MatSelectModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MaterialModule } from './material/app.module.material.';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { Form26asComponent } from './modules/form26as/form26as.component';
import { Form15ghComponent } from './modules/form15gh/form15gh.component';
import { ChallanComponent } from './modules/challan/challan.component';
import { Certificate197Component } from './modules/certificate197/certificate197.component';
import { ItrComponent } from './modules/itr/itr.component';
import { BankLayoutComponent } from './layouts/bank-layout/bank-layout.component';
import { ItdLayoutComponent } from './layouts/itd-layout/itd-layout.component';
import { FetchPanDetailsComponent } from './submodules/fetch-pan-details/fetch-pan-details.component';
import { SearchPanComponent } from './submodules/search-pan/search-pan.component';
import { AddForm15ghComponent } from './submodules/add-form15gh/add-form15gh.component';
import { ModulesModule } from './modules/modules.module';
import { SubmodulesModule } from './submodules/submodules.module';
import { Download26asComponent } from './submodules/download26as/download26as.component';
import { BankComponent } from './bank/bank.component';
import { BankService } from './bank/bank.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    Bank1Component,
    Bank2Component,
    ItdComponent,
    SidebarComponent,
    NavbarComponent,    
    BankLayoutComponent,
    ItdLayoutComponent,
    BankComponent
   
  ],
  imports: [MaterialModule, HttpModule, FormsModule, ReactiveFormsModule, AppRoutingModule,BrowserAnimationsModule, HttpClientModule,ModulesModule,SubmodulesModule],
  providers: [BankService],
  bootstrap: [AppComponent]
})
export class AppModule { }








