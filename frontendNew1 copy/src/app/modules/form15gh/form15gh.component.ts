import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form15gh',
  templateUrl: './form15gh.component.html',
  styleUrls: ['./form15gh.component.css']
})
export class Form15ghComponent implements OnInit {

  flgLoadFetchPANDetails: boolean = false;
  flgLoadSearchPAN: boolean = false;
  flgLoadAddForm15GH: boolean = false;
  flgCreateRulePAN: boolean = false;
  flgQueryRule: boolean = false;
  flgLoadSearchPANITD: boolean = false;
  loginType: string;
  flgShowITDItems: boolean = false;
  flgShowBankItems: boolean = false;
  constructor() { }

  ngOnInit() {
    this.loginType = sessionStorage.getItem("loginUserType");
    if (this.loginType == "BANK") {
      this.flgShowBankItems = true;
      this.flgShowITDItems = false;
    }
    else if (this.loginType == "ITD") {
      this.flgShowITDItems = true;
      this.flgShowBankItems = false;
    }
  }


  loadFetchPANDetails() {
    this.flgLoadSearchPAN = false;
    this.flgLoadAddForm15GH = false;
    this.flgLoadFetchPANDetails = true;
  }
  loadSearchPAN() {
    this.flgLoadFetchPANDetails = false;
    this.flgLoadAddForm15GH = false;
    this.flgLoadSearchPAN = true;
  }
  loadAddForm15GH() {
    this.flgLoadFetchPANDetails = false;
    this.flgLoadSearchPAN = false;
    this.flgLoadAddForm15GH = true;
  }
  loadQueryRule() {
    this.flgCreateRulePAN = false;
    this.flgQueryRule = true;
    this.flgLoadSearchPANITD = false;
  }
  loadCreateRule() {
    this.flgCreateRulePAN = true;
    this.flgQueryRule = false;
    this.flgLoadSearchPANITD = false;
  }
  loadSearchPANITD() {
    this.flgCreateRulePAN = false;
    this.flgQueryRule = false;
    this.flgLoadSearchPANITD = true;
  }
}
