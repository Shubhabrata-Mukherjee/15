import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;    
    class: string;
}
export const B_ROUTES: RouteInfo[] = [
  { path: 'form15gh', title: 'Form 15 G/H',   class: '' },
  { path: 'form26as', title: 'Form 26 AS',   class: '' },  
  { path: 'challan', title: 'Challan',   class: '' },
  { path: '197certificate', title: '197 Certificate',   class: '' },
  { path: 'itr', title: 'ITR',   class: '' },
];
export const I_ROUTES: RouteInfo[] = [
  { path: 'form15gh', title: 'Form 15 G/H',   class: '' },
  { path: 'formTDS', title: 'TDS Statement',   class: '' },
  { path: 'challan', title: 'Challan',   class: '' },
  { path: '197certificate', title: '197 Certificate',   class: '' },
  { path: 'itr', title: 'ITR',   class: '' },
];
@Component({
  selector: 'app-bank-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers:[LoginService]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
loginUserName:string;
loginType:string="";//this.loginService.getData();

constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginType=sessionStorage.getItem("loginUserType");
    console.log(this.loginType)
    if(this.loginType=="BANK"){
      this.loginUserName="Bank"
      this.menuItems = B_ROUTES.filter(menuItem => menuItem);
    }
    else if(this.loginType=="ITD"){
      this.loginUserName="ITD"
      this.menuItems = I_ROUTES.filter(menuItem => menuItem);
    }
    
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}

