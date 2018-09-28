import { Component, OnInit } from '@angular/core';


import{Bank2Service} from './bank2.service';

import {Tax } from './tx_detail';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { User_Detail } from '../user_detail';


@Component({
  selector: 'app-bank2',
  templateUrl: './bank2.component.html',
  styleUrls: ['./bank2.component.css'],
  providers:[Bank2Service]
  
})
export class Bank2Component implements OnInit {

      //for26AS
      temp2:boolean=false;
      // flags for 15 G/H
      GH_flag:boolean=false;

      // flags for create rule
      CR_flag:boolean=false;

      // flags for search
      S_flag:boolean=false;

      // flags for All transaction 
      T_flag:boolean=false;
      //flag to view pan details
      V_flag:boolean=false;
      //pan details table
      T_V_flag:boolean = false;
      loader:boolean=false;
      lt=[]
      show_pan_number:string="";
      show_fy_year:string="";
      cumulative_net =""
      cumulative_interest = ""
      cumulative_other =""
      cumulative_deduction =""
      fileuser:any;
      filename:any;



      // for  PAN userDetails

      users:User_Detail[];
      errorMessage_user:string;

      pan_user:User_Detail;

      user_record:boolean;
      mp = {}
      value:any
      pan:string
      year:string
      i_amount:string
      o_amount:string
      d_amount:string
      pan_det:string;
      details:any[] =[];
      detail:any;
      pan_number_26AS2:string;



  //  for transaction  details
          taxes: any[]=[];
          errorMessage: string;
          total: number = 0;
          tempTax:any[];

          viewAll:boolean=false;
          view:boolean=false;

          //for 26AS
          f2(){
            this.temp2=true;
            this.T_flag=false;
            this.S_flag=false;
            this.CR_flag=false;
            this.V_flag = false;
            this.T_V_flag = false;
            this.GH_flag=false;
          }

            viewAllTransaction(){
              this.viewAll=true;
              this.temp2=false;
          }


          show_RS(){
            this.GH_flag=true;
            this.temp2=false;
          }

          show_Rule(){
            this.T_flag=false;
            this.S_flag=false;
            this.CR_flag=true;
            this.V_flag = false;
            this.T_V_flag = false;
            this.temp2=false;
          }

          show_Search(){
            this.T_flag=false;
            this.CR_flag=false;
            this.S_flag=true;
            this.V_flag = false;
            this.T_V_flag = false;
            this.temp2=false;
          }
          show_Details() {
            this.T_flag=false;
            this.CR_flag=false;
            this.S_flag=false;
            this.V_flag = true;
            this.T_V_flag = false;
            this.temp2=false;
          }

          show_TransactionHistory(){
            this.S_flag=false;
            this.CR_flag=false;
            this.T_flag=true;
            this.T_V_flag = false;
            this.temp2=false;
          }
          
            //for 26AS
            // getdocument2() {
            //   this.bank2.getdocument2(this.pan_number_26AS2).subscribe(
                
            //     res=> {
            //       console.log("Response",res)
            //       console.log("PAN1",this.pan_number_26AS2)
            //     }
            //     ,(err)=> {
            //       alert("Error"+err);
            //       //console.log("Err",err);
            //       console.log("PAN2",this.pan_number_26AS2)
            //     },
        
            //   );
  
            // }
              //for 26AS
              getdocument2() {
                this.loader=true;         
                this.bank2.getdocument2(this.pan_number_26AS2,this.filename).subscribe(
                  
                  res=> {
                    console.log("Response",res)
                    console.log("PAN1",this.pan_number_26AS2)
                    // alert(this.filename)
                    alert(res.MssgStr)
                    this.loader=false;
                  }
                  ,(err)=> {
                    alert("Error"+err);
                    console.log("Err",err);
                    console.log("PAN2",this.pan_number_26AS2)
                    // alert(this.filename)
                  },
                  ()=>{
                    setTimeout( () => { this.loader=false }, 3000 );
                  }

                );

              }


              onFileChange(event) {
                if(event.target.files && event.target.files.length > 0) {
                  let file = event.target.files[0];              
                  this.filename = file.name
                  //alert(this.filename)
                }
                }

         

          // user detail based on pan number
          searchUser(pan_number:string){
            this.tempTax = [];
            this.total = 0;

            this.user_record=false;    // records are available

            if(pan_number!==''){
              this.pan_user=this.users.filter(x=>(x.pan_number===pan_number))[0];
              
              
  
                this.tempTax = this.taxes.filter(
                  tx => (tx.pan_number === pan_number));

                  if(this.tempTax.length==0)
                       this.user_record=true; //records are not available
  
  
  
              // you can iterate here to get total balance
              for (let i = 0; i < this.tempTax.length; i++) {
                this.total = this.total + this.tempTax[i].amount;
              }
  
              this.view = true;
            }

            if(pan_number=='')
                   this.user_record=true;  //records are not available

            
          }



    //  //  pan_number:string based search

          // viewTransaction(pan_number: string) {

          //   this.tempTax = [];
          //   this.total = 0;



          //   if (pan_number !== '')
          //     this.tempTax = this.taxes.filter(
          //       tx => (tx.pan_number === pan_number));



          //   // you can iterate here to get total balance
          //   for (let i = 0; i < this.tempTax.length; i++) {
          //     this.total = this.total + this.tempTax[i].amount;
          //   }

          //   this.view = true;
          // }



  constructor(private bank2: Bank2Service ,private router: Router) { 

    
    // var myDate = new Date();
    // var year = myDate.getFullYear();
    // for(var i = 1900; i < year+1; i++){
    //   document.write('<option value="'+i+'">'+i+'</option>');
    // }
    

  }




// contactListCtrl($scope) {

// var year = new Date().getFullYear();
// var range = [];
// range.push(year);
//  for (var i = 1; i < 7; i++) {
//      range.push(year + i);
//  }
//  $scope.years = range;


//  };


  // bank2 transaction details
  // getTaxes() {
  //   this.bank2.getTaxes().subscribe(
  //     taxes => this.taxes = taxes,
  //     error => this.errorMessage = <any>error);
  // }

  getTaxes() {
    
    this.bank2.getTaxes().subscribe(
      res=> {
        console.log("Resp is: ",res.Query)
        var x = JSON.parse(res.Query)
        console.log("x  ",x)
        console.log("Keys are : "+Object.keys(x))
         for(let i in x) {
          console.log("Details: "+x[i])
           var p = JSON.parse(x[i])
           console.log("P is: ",p)
           for(let j = 0; j < p.length; j++) {
            // var tax :Tax = new Tax();
            // tax.amount = p[j].TOTAL_AMOUNT;
            // tax.fy_year = p[j].YEAR;
            // tax.pan_number = p[j].PAN_NUMBER;
            if (p[j].YEAR != 0) {
              this.taxes.push({"pan_number":p[j].PAN_NUMBER,"fy_year":p[j].YEAR,"total_amount":p[j].TOTAL_AMOUNT,"deduction_amount":p[j].DEDUCTION_AMOUNT,"other_amount":p[j].OTHER_AMOUNT,"interest_amount":p[j].INTEREST_AMOUNT});
            }

            
          }
        }
        console.log("Tax is : ",this.taxes)

    
       // console.log("this.taxes after getting: "+this.taxes)

      }  ,
      err => {
        console.log("Some error occured fetching taxes")
      }
    );
  }

  // // user details
  

  Fetch_Pan() {
    this.T_V_flag = !(this.T_V_flag)
  }
  getCumulative() {
    this.bank2.getCumulative(this.show_pan_number,this.show_fy_year).subscribe(
      res=>{ 
        console.log(res)
        this.cumulative_net = res.Cumulative_net
        this.cumulative_interest = res.Cumulative_interest
        this.cumulative_other = res.Cumulative_other
        this.cumulative_deduction = res.Cumulative_deduction
      }
    )
  }
  Update_15G() {
    /*  pan:string
      year:string
      i_amount:string
      o_amount:string
      d_amount:string */
      this.details = []

      this.bank2.getUser_Detail(this.pan)
        .subscribe(
          res => {
            console.log("Add resp: ",res.Details)
            this.details.push(res.Details)
            this.detail  = this.details[0]
          },
          err=> {
            alert("Error"+err);
          },
          ()=>{
            this.bank2.addTax(this.pan,'15G/H',this.year,this.i_amount,this.o_amount,this.d_amount,this.details[0].gender,this.details[0].dob).subscribe(
              res=>{ 
                console.log("Ress",res)
                //alert(res.Result)
              },
              (err)=> {
                console.log(err)
              }
            )
          }
        )

        //setTimeout(this.Update_15G, 3000);


        

  }

   
viewTransaction(pan_number:string,fy_year:string){
  this.details = []

  this.bank2.getUser_Detail(pan_number)
    .subscribe(
      res => {
        console.log("Add resp: ",res.Details)
        this.details.push(res.Details)
        this.detail  = this.details[0]
      },
      err=> {
        alert("Error"+err);
      },
      ()=>{
        console.log("Details is",this.details) 

        this.tempTax=[];
        this.total = 0;
        console.log("this.taxes is ",this.taxes)
        console.log("year :"+fy_year+" pan_number: "+pan_number)
        if(fy_year!=='' && pan_number!=='')
          this.tempTax=this.taxes.filter(
              tx => (tx.fy_year===Number(fy_year) && tx.pan_number===pan_number));

        else if(pan_number!=='')
          this.tempTax=this.taxes.filter(
            tx => (tx.pan_number===pan_number));

        else if(fy_year!=='')
            this.tempTax=this.taxes.filter(
              tx => (tx.fy_year===Number(fy_year)));
        console.log("Texmp taxes: ",this.tempTax)



        // you can iterate here to get total balance
        for(let i = 0; i<this.tempTax.length; i++) {
            this.total = this.total + this.tempTax[i].total_amount;
        }
          console.log("Amount total: "+this.total)

        this.view = true;
      }
    );

    
}
radio_gender(value: string) {
  this.mp["M"] = false;
  this.mp["F"] = false;
  this.mp["T"] = false;
  this.value = value 
  this.mp[value]= !(this.mp[value])
  console.log("value: ",value)
console.log("MAp: ",this.mp)


}


getUser_Detail() {
  this.T_V_flag = !(this.T_V_flag);
  this.details = []

  this.bank2.getUser_Detail(this.pan_det)
    .subscribe(
      res => {
        console.log("Add resp: ",res.Details)
        this.details.push(res.Details)
        this.detail  = this.details[0]
      },
      err=> {
        alert("Error"+err);
      }
    );

    console.log("Details is",this.details)    
}
closeNav() {
  alert("123")
  document.getElementById("mySidenav").style.width = "0";
}
openNav() {
  document.getElementById("mySidenav").style.width = "10%";
}
getHistory() {
  //this.T_flag = true;
  this.bank2.getHistory(this.show_pan_number).subscribe(
    res=> {
      this.lt=[]
        console.log("History",res)
        for (let i = 0; i < JSON.parse(res.Org2).length; i++) {
          for(let j = 0; j < JSON.parse(res.Org2)[i].Value.length; j++) {
            console.log("******************************************************************************************************************************************************************************************************************************")
            console.log("VALUES",JSON.parse(res.Org2)[i].Value[j])
            // console.log(this.show_fy_year)
            console.log("******************************************************************************************************************************************************************************************************************************")
            if(parseInt(JSON.parse(res.Org2)[i].Value[j].YEAR) == parseInt(this.show_fy_year)) {
              this.lt.push(["Org2",JSON.parse(res.Org2)[i].Value[j]])
            }
          }
          
        }
        
        console.log("Lt",this.lt)
    }
  )
}



  ngOnInit() {

    this.getTaxes();
    this.GH_flag=true
    this.V_flag = true;

  }




  log_out(){
    sessionStorage.clear();
    this.router.navigate(['/login'])
  }

}
function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}








// allProfiles: Profile[]; 
// let userProfile: Profile = form.controls['profile'].value;






  //add tax

  