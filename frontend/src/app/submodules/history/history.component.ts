import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, tap, map } from "rxjs/operators";

import { Observable } from 'rxjs/Observable';
import { ItdService } from '../../itd/itd.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers:[ItdService]
})
export class HistoryComponent implements OnInit {

  constructor(private http: HttpClient, private itdservice : ItdService) { }
  pan26as:string
  loader:boolean=false;
    loader1:boolean=false;
    txarray:any;
    query_26:boolean=false;

  ngOnInit() {
  }
  private handleError(err: HttpErrorResponse) {
    console.error(err);
      return Observable.throw(err.error() || 'Server error'); 
    }

    getdocumentHistory() {
      this.loader1=true;
      this.query_26=true
      console.log("loader",this.loader)
      this.txarray = []
      console.log("this.pan_number_26AS",this.pan26as)
      this.itdservice.getdocumentHistory(this.pan26as).subscribe(
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

}
