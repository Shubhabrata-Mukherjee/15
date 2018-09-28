import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, tap, map } from "rxjs/operators";
import { saveAs } from 'file-saver';
import * as $ from 'jquery';
import { Observable } from 'rxjs/Observable';
import { ItdService } from '../../itd/itd.service';
@Component({
  selector: 'app-download26as',
  templateUrl: './download26as.component.html',
  styleUrls: ['./download26as.component.css'],
  providers:[ItdService]
})
export class Download26asComponent implements OnInit {

  constructor(private http: HttpClient,private itdservice:ItdService) { }
  QR_flag:boolean=false;
  show_1:boolean = false;
  show_2:boolean = false;
  loader:boolean=false;
  loader1:boolean=false;
  doc:any;
  txarray:any;
  ngOnInit() {
  }
  pan26as:string
  private handleError(err: HttpErrorResponse) {
    console.error(err);
      return Observable.throw(err.error() || 'Server error'); 
    }

    getdocument() {
      this.loader = true;

      this.itdservice.getdocument(this.pan26as).subscribe(
        res => {
          console.log("loader",this.loader)
          console.log("in get doc")
          console.log("response",res)
          saveAs(res, this.pan26as+".pdf"); //if you want to save it - you need file-saver for this : https://www.npmjs.com/package/file-saver
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
    

  }