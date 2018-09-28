import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import{Bank1Service} from '../../bank1/bank1.service';
import SubModulesUtility from '../helper-methods';

@Component({
  selector: 'app-fetch-pan-details',
  templateUrl: './fetch-pan-details.component.html',
  styleUrls: ['./fetch-pan-details.component.css'],
  providers:[Bank1Service]
})
export class FetchPanDetailsComponent implements OnInit {
  isLoaderVisible:boolean=false;
  strPanDetails:string;
  flgShowRecords:boolean=false;
  arrPANDetails:any[]=[];
  notifyMessage:string;
  constructor(private bank1: Bank1Service ,private router: Router) { }

  ngOnInit() {
  }
  fetchUserPANDetails() {  
    this.isLoaderVisible=true;  
    this.arrPANDetails = []
  
    this.bank1.getUser_Detail(this.strPanDetails)
      .subscribe(
        res => {          
          console.log("API response: ",res.Details)
          if(res.Details != null){
            this.flgShowRecords=true;
            this.arrPANDetails.push(res.Details)
            this.notifyMessage = "Fetch for PAN successful."
            SubModulesUtility.showNotification(this.notifyMessage)
            this.isLoaderVisible=false;
          }
          
          //this.detail  = this.details[0]
        },
        err=> {
          this.flgShowRecords=false;
          alert("Error"+err);
          this.isLoaderVisible=false;
        }
      );
  
      console.log("Details is",this.arrPANDetails)    
  }
}
