import { BrowserModule } from '@angular/platform-browser';
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



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    Bank1Component,
    Bank2Component,
    ItdComponent
    
  ],
  imports: [MaterialModule,BrowserModule, HttpModule, FormsModule, ReactiveFormsModule, AppRoutingModule, HttpClientModule,BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }








