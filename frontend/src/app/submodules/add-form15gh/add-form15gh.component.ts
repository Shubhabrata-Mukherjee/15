import { Component, OnInit } from '@angular/core';
import { User_Detail } from '../../user_detail';
import { Bank1Service } from '../../bank1/bank1.service';
import SubModulesUtility from '../helper-methods';
import { BankService } from '../../bank/bank.service';

@Component({
  selector: 'app-add-form15gh',
  templateUrl: './add-form15gh.component.html',
  styleUrls: ['./add-form15gh.component.css'],
  providers:[Bank1Service]
})
export class AddForm15ghComponent implements OnInit {
  users:User_Detail[];
  errorMessage_user:string;
  notifyMessage:string;
  pan_user:User_Detail;
  isLoaderVisible:boolean=false;
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
  constructor(private bank: BankService) { }

  ngOnInit() {
  }
  Update_15G() {
    this.isLoaderVisible=true;
      this.details = []
      var name=sessionStorage.getItem("username")
      this.bank.getUser_Detail(name,this.pan)
        .subscribe(
          res => {
            console.log("Add resp: ",res.Details)
            this.details.push(res.Details)
            this.detail  = this.details[0]
          },
          err=> {
            alert("Error"+err);
            location.reload
          },
          ()=>{
            this.bank.addTax(name,this.pan,'15G/H',this.year,this.i_amount,this.o_amount,this.d_amount,this.details[0].gender,this.details[0].dob).subscribe(
              res=>{ 
                console.log("Ress",res)
                //alert(res.Result)
                location.reload
                this.notifyMessage = "Form 15 G/H added successfully."
                SubModulesUtility.showNotification(this.notifyMessage)
                this.isLoaderVisible=false;
              },
              (err)=> {
                console.log(err)
                this.isLoaderVisible=false;
              }
              
            )
          }
        )


        

  }
}
