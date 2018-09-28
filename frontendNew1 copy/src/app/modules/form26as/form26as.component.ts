import { Component, OnInit } from '@angular/core';
import { Bank1Service } from '../../bank1/bank1.service';

@Component({
  selector: 'app-form26as',
  templateUrl: './form26as.component.html',
  styleUrls: ['./form26as.component.css'],
  providers:[Bank1Service]
})
export class Form26asComponent implements OnInit {
  pan_number_26AS1:string;
  filename:any;
  constructor(private bankService: Bank1Service) { }

  ngOnInit() {
  }
  getdocument1() {
    //this.loader = true;
    this.bankService.getdocument1(this.pan_number_26AS1,this.filename).subscribe(
      
      res=> {
        console.log("Response",res)
        console.log("PAN1",this.pan_number_26AS1)
        // alert(this.filename)
        alert(res.MssgStr)
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
