import { Component, OnInit } from '@angular/core';
import{Tax} from './tax';
import { Bank1Service } from '../bank1/bank1.service';
import { Bank2Service } from '../bank2/bank2.service';
import { Bank2Component } from '../bank2/bank2.component';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http/src/headers';

import {catchError, tap, map } from "rxjs/operators";
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Observable } from 'rxjs/Observable';
import { ItdService } from './itd.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import * as $ from 'jquery';

@Component({
  selector: 'app-itd',
  templateUrl: './itd.component.html',
  styleUrls: ['./itd.component.css'],
  providers:[Bank1Service,Bank2Service,ItdService]
})
export class ItdComponent implements OnInit {
    //26AS
    AS_flag:boolean=false;
    // flags for 15 G/H
    GH_flag:boolean=false;
    temp:boolean=false;
    // flags for create rule
    CR_flag:boolean=false;
    query_26:boolean=false;

    // flags for search
    S_flag:boolean=false;

    // flags for All transaction 
    T_flag:boolean=false;

    t1:boolean=false;
    //Flag for Query Rules
    QR_flag:boolean=false;
    show_1:boolean = false;
    show_2:boolean = false;
    loader:boolean=false;
    loader1:boolean=false;
    doc:any;
    txarray:any;


    //Value of RULE_TYPE
    Rule_type :string = "";

    Tax_type:string;
    Gender_type:string;
    Year_type:string;
    Tax_type_query:string;
    Gender_type_query:string;
    Year_type_query:string;
    Amount_general:string;
    Amount_senior:string;
    Age_senior:string;
    Amount_supersenior:string;
    Age_supersenior:string;
    pan_number:string;
    pan_number_26AS:string;
    fy_year:string
    cumulative_net:string;
    cumulative_interest:string;
    cumulative_other:string;
    cumulative_deduction:string
    lt:any[] =[]


show_AS()
{
  this.t1=false;
this.AS_flag=true;  
this.temp=false;
this.GH_flag=false;
this.CR_flag=false;
this.T_flag=false;
this.S_flag=false;
this.QR_flag=false;
} 

    show_RS(){
      this.t1=false;
      this.AS_flag=false;
      this.temp=false;
      this.GH_flag=true;
      this.Rule_type = "15G/H";
    }

    show_Rule(){
      this.t1=false;
      this.AS_flag=false;
      this.temp=false;
      this.T_flag=false;
      this.S_flag=false;
      this.CR_flag=true;
      this.QR_flag = false;
      this.query_26=false;
    }

    show_Search(){
      this.t1=false;
      this.AS_flag=false;
      this.temp=false;
      this.T_flag=false;
      this.CR_flag=false;
      this.S_flag=true;
      this.QR_flag = false;
      this.query_26=false;

    }
    show_Query() {
      this.t1=false;
      this.AS_flag=false;
      this.temp=false;
      this.T_flag=false;
      this.CR_flag=false;
      this.S_flag=false;
      this.QR_flag = true;
      this.query_26=false;

    }

    //26AS
    create_Hash(){
      this.t1=false;
      this.AS_flag=true;
      this.temp=true;
      this.T_flag=false;
      this.CR_flag=false;
      this.S_flag=false;
      this.QR_flag = false;
      this.query_26=false;

    }
    show_History(){
      this.t1=true;
      this.AS_flag=true;
      this.temp=false;
      this.T_flag=false;
      this.CR_flag=false;
      this.S_flag=false;
      this.QR_flag = false;
    }
    getdocumentHistory() {
      this.loader1=true;
      console.log("loader",this.loader)
      this.txarray = []
      console.log("this.pan_number_26AS",this.pan_number_26AS)
      this.itdservice.getdocumentHistory(this.pan_number_26AS).subscribe(
        res => {
          if(res.MssgStr == "PAN not found") {
            alert("PAN not found")
          } else {
            console.log("l",JSON.parse(res.MssgStr))
            for (let i = 0;i < JSON.parse(res.MssgStr).length; i++) {
              console.log("JSON.parse((res.MssgStr)[i])",JSON.parse(res.MssgStr)[i].Value) 
              for (let j = 0; j < JSON.parse(res.MssgStr)[i].Value.length; j++) {
                this.txarray.push(JSON.parse(res.MssgStr)[i].Value[j]);
              }               
            }
             
            
            // for (let i = 0;i < JSON.parse(res.MssgStr).length; i++) {
            //     console.log("val",JSON.parse(res.MssgStr)[i])
            //     this.txarray.push(JSON.parse(res.MssgStr)[i])
            //     // alert(res.MssgStr)
            // }
          }
        }
        ,(err)=> {
          console.log("Err",err);
          this.loader1 = false;
        }
        ,()=>{
          setTimeout( () => { this.loader1=false;$('.modal-backdrop').remove(); }, 2000 );
          //console.log("loader",this.loader1)
        }
        // ,
        // ()=> {
        //   var blob = new Blob([this.doc], { type: 'pdf' });
        //   var url= window.URL.createObjectURL(blob);
        //   window.open(url);
        // }
      );

    }
    getdocument() {
      this.loader = true;

      this.itdservice.getdocument(this.pan_number_26AS).subscribe(
        res => {
          console.log("loader",this.loader)
          console.log("in get doc")
          console.log("response",res)
          saveAs(res, this.pan_number_26AS+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
          console.log("url create")
          var fileURL = URL.createObjectURL(res);
          console.log("url finish")

          window.open(fileURL); 
          this.loader = false;
          
          // alert("Download complete")
        }
        ,(err)=> {
          console.log("Err",err);
          alert("Error"+err)
        },()=>{
          setTimeout( () => { this.loader=false;$('.modal-backdrop').remove();}, 2000 );
          console.log("loader",this.loader)

        }
        // ,
        // ()=> {
        //   var blob = new Blob([this.doc], { type: 'pdf' });
        //   var url= window.URL.createObjectURL(blob);
        //   window.open(url);
        // }
      );

    }
    show_TransactionHistory(){
      this.AS_flag=false;
      this.S_flag=false;
      this.CR_flag=false;
      this.T_flag=true;
      this.QR_flag = false;
      this.temp=false;
    }

  
  errorMessage1: string;
  errorMessage2: string;
  view:boolean=false;
  taxes: Tax[];
  taxeses:Tax[];
  total: number = 0;


  // for setting the max amount as per gender of user
  gender:string[];
  limitAmount:number[];
  gndr:string;
  amountgeneral:string;
  amountsenior:string;
  ages:string;
  arr = []
  flg :boolean = false;


  taxes1:Tax[] = []; // for bank1 transaction
  taxes2:Tax[] = []; // for bank2 transaction


    

  constructor(private bank1service:Bank1Service,private bank2service:Bank2Service,private itdservice:ItdService,private router: Router) {

   }
   updateRules() {
    this.itdservice.updateRules(this.Rule_type,this.Tax_type,this.Year_type,this.Gender_type,this.Amount_general,this.Amount_senior,this.Amount_supersenior,this.Age_senior,this.Age_supersenior).subscribe(
      res=> {
        console.log("Resp",res)
        alert("Updation "+res.Result)
      },
      err => {
        console.log("Error updating rules")
      }
    )
   }

   getRules() {
    this.arr =[]
    // Rule_type :string = "";

    // Tax_type:string;
    // Gender_type:string;
    // Age_type:string;
    this.itdservice.getRules().subscribe(
      res=> {
        //console.log("Resp",JSON.parse(res.Rules))
        var diction = JSON.parse(res.Rules)
       // alert(this.Rule_type)
        for (let i = 0; i < Object.keys(diction).length; i++) {
         //console.log(diction[Object.keys(diction)[i]])
         let dict = diction[Object.keys(diction)[i]];
            for (let j = 0; j < Object.keys(dict).length; j++) {
                this.arr.push(JSON.parse(dict[Object.keys(dict)[j]]))
            }
        }
        console.log("Arr is",this.arr)

        if (!(this.Rule_type === undefined)) {
          let that = this;
          this.arr = this.arr.filter(function (element) {
            //console.log("Element is",element)
         
            //console.log("this.Rule_type",that.Rule_type)
            return (element.RULE_TYPE === that.Rule_type);
         })
       } 

        if (!(this.Tax_type_query === undefined || this.Tax_type_query == "")) {
          let that = this;
          this.arr = this.arr.filter(function (element) {
              return (element.RULE_INCOME === that.Tax_type_query);
          })
        } 
      
        if (!(this.Gender_type_query === undefined || this.Gender_type_query == "")) {
          let that = this;
          this.arr = this.arr.filter(function (element) {
            return (element.GENDER === that.Gender_type_query);
          })
        } 
      

        if(!(this.Year_type_query === undefined || this.Year_type_query == "") ) {
          let that = this;
          this.arr = this.arr.filter(function (element) {
            return (element.RULE_YEAR === that.Year_type_query);
          })
        }

        this.arr = this.arr.filter(function (element) {
          return (element.RULE_YEAR !== "0");
        })

        console.log("Array length is: ",this.arr) 
      },
      err => {
        console.log("Error getting rules")
      }
    )

   

  }
  getHistory() {
    //this.T_flag = true;
    this.lt=[]

    this.itdservice.getHistory(this.pan_number).subscribe(
      res=> {
          console.log("History",res)
          for (let i = 0; i < JSON.parse(res.Org1).length; i++) {
            console.log("PAN",this.pan_number,"Retrieved PAN",JSON.parse(res.Org1)[i].Value[0].PAN_NUMBER)
            if(JSON.parse(res.Org1)[i].Value[0].PAN_NUMBER == this.pan_number && JSON.parse(res.Org1)[i].Value[0].YEAR == this.fy_year) {
              this.lt.push(["Org1",JSON.parse(res.Org1)[i]])
            }
          }
          for (let i = 0; i < JSON.parse(res.Org2).length; i++) {
            console.log("PAN",this.pan_number,"Retrieved PAN",JSON.parse(res.Org2)[i].Value[0].PAN_NUMBER)

            if(JSON.parse(res.Org2)[i].Value[0].PAN_NUMBER == this.pan_number && JSON.parse(res.Org2)[i].Value[0].YEAR == this.fy_year) {
              this.lt.push(["Org2",JSON.parse(res.Org2)[i]])
            }
          }
          console.log("Lt",this.lt)
      }
    )
  }

  getCumulative() {
    this.itdservice.getCumulative(this.pan_number,this.fy_year).subscribe(
      res=>{ 
        console.log(res)
        this.cumulative_net = res.Cumulative_net
        this.cumulative_interest = res.Cumulative_interest
        this.cumulative_other = res.Cumulative_other
        this.cumulative_deduction = res.Cumulative_deduction
      }
    )
  }


  

  viewTransaction(pan_number: string, fy_year: string) {


    this.taxes = [];
    this.total = 0;


    if (fy_year !== '' && pan_number !== '')
      this.taxes = this.taxes1.concat(this.taxes2).filter(
        tx => (tx.fy_year === Number(fy_year) && tx.pan_number === pan_number));

    else if (pan_number !== '')
      this.taxes = this.taxes1.concat(this.taxes2).filter(
        tx => (tx.pan_number === pan_number));

    else if (fy_year !== '')
      this.taxes = this.taxes1.concat(this.taxes2).filter(
        tx => (tx.fy_year === Number(fy_year)));

    for (let i = 0; i < this.taxes.length; i++) {
      this.total = this.total + this.taxes[i].amount;
    }

    this.view = true;
  }
 


          ngOnInit() {
            this.GH_flag=true
            this.CR_flag=true;
            this.Rule_type = "15G/H";
          }

          log_out(){
            sessionStorage.clear();
            this.router.navigate(['/login'])
          }

}



