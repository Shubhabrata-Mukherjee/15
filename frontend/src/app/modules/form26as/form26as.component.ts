import { Component, OnInit } from '@angular/core';
import { Bank1Service } from '../../bank1/bank1.service';
import SubModulesUtility from '../../submodules/helper-methods';


@Component({
  selector: 'app-form26as',
  templateUrl: './form26as.component.html',
  styleUrls: ['./form26as.component.css'],
  providers:[Bank1Service]
})
export class Form26asComponent implements OnInit {
  pan_number_26AS1:string;
  filename:any;
  loginType: string;
  flgQueryRule : boolean = false
  flgCreateRulePAN: boolean = false;
  notifyMessage:string;
  flgShowITDItems: boolean = false;
  flgShowBankItems: boolean = false;


  constructor(private bankService: Bank1Service) { }

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


  Download() {
    this.flgCreateRulePAN = true;
    this.flgQueryRule = false;

  }

  History(){
    this.flgCreateRulePAN = false;
    this.flgQueryRule = true;

  }
  getdocument1() {
    //this.loader = true;
    this.bankService.getdocument1(this.pan_number_26AS1,this.filename).subscribe(
      
      res=> {
        console.log("Response",res)
        console.log("PAN1",this.pan_number_26AS1)
        this.notifyMessage = res.MssgStr
        SubModulesUtility.showNotification(this.notifyMessage)
        //this.loader=false;
      }
      ,(err)=> {
        alert("Error"+err);
        console.log("Err",err);
        console.log("PAN2",this.pan_number_26AS1)
      },
      ()=>{
        setTimeout( () => 
        { 
          //this.loader=false 
        }
        , 3000 );
      }

    );

  }
  onFileChange(event) {
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];              
      this.filename = file.name
    }
    }
}
