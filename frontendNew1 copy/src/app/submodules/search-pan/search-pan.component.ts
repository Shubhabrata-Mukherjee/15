import { Component, OnInit } from '@angular/core';
import { Bank1Service } from '../../bank1/bank1.service';
import { ItdService } from '../../itd/itd.service';

@Component({
  selector: 'app-search-pan',
  templateUrl: './search-pan.component.html',
  styleUrls: ['./search-pan.component.css'],
  providers: [Bank1Service,ItdService]
})
export class SearchPanComponent implements OnInit {
  details: any[] = [];
  detail: any;

  taxes: any[] = [];
  errorMessage: string;
  total: number = 0;
  tempTax: any[];

  viewAll: boolean = false;
  view: boolean = false;
  lt = []
  show_pan_number: string = "";
  pan_number:string;
  show_fy_year: string = "";
  fy_year:string
  cumulative_net = ""
  cumulative_interest = ""
  cumulative_other = ""
  cumulative_deduction = ""
  fileuser: any;
  filename: any;
  loginType: string;
  flgShowITDItems: boolean = false;
  flgShowBankItems: boolean = false;
  constructor(private bank1: Bank1Service,private itdservice : ItdService) { }

  ngOnInit() {
    this.getTaxes();
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
  viewTransactionBank(pan_number: string, fy_year: string) {
    this.details = []

    this.bank1.getUser_Detail(pan_number)
      .subscribe(
        res => {
          console.log("Add resp: ", res.Details)
          this.details.push(res.Details)
          this.detail = this.details[0]
        },
        err => {
          alert("Error" + err);
        },
        () => {
          console.log("Details is", this.details)

          this.tempTax = [];
          this.total = 0;
          console.log("this.taxes is ", this.taxes)
          console.log("year :" + fy_year + " pan_number: " + pan_number)
          if (fy_year !== '' && pan_number !== '')
            this.tempTax = this.taxes.filter(
              tx => (tx.fy_year === Number(fy_year) && tx.pan_number === pan_number));

          else if (pan_number !== '')
            this.tempTax = this.taxes.filter(
              tx => (tx.pan_number === pan_number));

          else if (fy_year !== '')
            this.tempTax = this.taxes.filter(
              tx => (tx.fy_year === Number(fy_year)));
          console.log("Texmp taxes: ", this.tempTax)



          // you can iterate here to get total balance
          for (let i = 0; i < this.tempTax.length; i++) {
            this.total = this.total + this.tempTax[i].total_amount;
          }
          console.log("Amount total: " + this.total)

          this.view = true;
        }
      );


  }
  getHistoryBank() {
    //this.T_flag = true;
    this.bank1.getHistory(this.show_pan_number).subscribe(
      res => {
        this.lt = []
        console.log("History", res)
        for (let i = 0; i < JSON.parse(res.Org1).length; i++) {
          if (JSON.parse(res.Org1)[i].Value[0].PAN_NUMBER == this.show_pan_number && JSON.parse(res.Org1)[i].Value[0].YEAR == this.show_fy_year) {
            this.lt.push(["Org1", JSON.parse(res.Org1)[i]])
          }
        }

        console.log("Lt", this.lt)
      }
    )
  }
  getCumulativeBank() {
    this.bank1.getCumulative(this.show_pan_number,this.show_fy_year).subscribe(
      res=>{ 
        console.log(res)
        this.cumulative_net = res.Cumulative_net
        this.cumulative_interest = res.Cumulative_interest
        this.cumulative_other = res.Cumulative_other
        this.cumulative_deduction = res.Cumulative_deduction
      }
    )
  }
  getTaxes() {
    
    this.bank1.getTaxes().subscribe(
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
  getHistoryITD() {
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

  getCumulativeITD() {
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
}
