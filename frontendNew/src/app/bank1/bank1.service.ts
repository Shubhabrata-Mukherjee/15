import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tap, catchError, map } from 'rxjs/operators';
import{ Tax } from './tx_detail';
import { User_Detail } from '../user_detail';

@Injectable()
export class Bank1Service {


 // getTaxes(): Observable<Tax[]> {
  //   return this.http.get<Tax[]>('assets/banks/bank1.json').pipe(
  //     tap(data => console.log("All: " + JSON.stringify(data))),
  //     catchError(this.handleError));
  constructor(private http: HttpClient) { }

  // }
  getTaxes() :Observable <any> {
    var token = sessionStorage.getItem('token');
    console.log("Token received: "+token)
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'Application/json; charset=UTF-8',
        'authorization':"Bearer "+token
        }),
        };
        
    return this.http.get("http://127.0.0.1:8000/query/org1/all", httpOptions).pipe(map((response: Response) => {
        console.log("Response Query: ",JSON.parse(JSON.stringify(response)).Query);

        return response;
    }),tap(event => {}, this.handleError))

}

  getUser_Detail(pan_number:string): Observable<any> {
    ///pan/pull/:id/
    var token = sessionStorage.getItem('token');
    console.log("Token received: "+token)
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'Application/json; charset=UTF-8',
        'authorization':"Bearer "+token
        }),
        };
    return this.http.get("http://127.0.0.1:8000/pan/pull/"+pan_number, httpOptions).pipe(map((response: Response) => {
        console.log("Response Query: ",JSON.parse(JSON.stringify(response)).Details);

        return response;
    }),tap(event => {}, this.handleError))
  }
  addTax(pan_number:string,rule_type:string,fy_year:string,interest_amount:string,other_amount:string,deduction_amount:string,gender:string,dob:string) {
    
    var token = sessionStorage.getItem('token');
    console.log("Token received: "+token)
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'Application/json; charset=UTF-8',
        'authorization':"Bearer "+token
        }),
        };
        console.log("Id is : "+pan_number)

    return this.http.post("http://127.0.0.1:8000/update/org1/"+pan_number,JSON.stringify({"rule_type":rule_type,"fy_year":fy_year,"interest_amount":interest_amount,"other_amount":other_amount,"deduction_amount":deduction_amount,"gender":gender,"dob":dob}), httpOptions).pipe(map((response: Response) => {
        console.log("Response Query: ",response);

        return response;
    }),tap(event => {}, this.handleError))
 
    
  }

  getCumulative(pan_number:string,fy_year:string) :Observable <any> {
    var token = sessionStorage.getItem('token')
    console.log("Token for update rules",token)
  
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'Application/json; charset=UTF-8',
        'authorization': 'Bearer '+token
        }),
        };
        
        
    return this.http.get("http://127.0.0.1:8000/cumulative/"+pan_number+"/"+fy_year, httpOptions).pipe(map((response: Response) => {
        console.log("Response: ",response);
        return response;
    }),tap(event => {}, this.handleError))
  
  }
  createPan(pan_number:string,gender:string,dob: string) {
    
    var token = sessionStorage.getItem('token');
    console.log("Token received: "+token)
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'Application/json; charset=UTF-8',
        'authorization':"Bearer "+token
        }),
        };
        var body = JSON.stringify({"id":pan_number,"gender":gender,"dob":dob});
        console.log("Id is : "+pan_number +  "Gender: "+gender + "dob: "+dob)

    return this.http.post("http://127.0.0.1:8000/pan/create/org1/",body, httpOptions).pipe(map((response: Response) => {
        console.log("Response Query: ",response);

        return response;
    }),tap(event => {}, this.handleError))

  }

  getHistory(pan_number:string) :Observable <any> {
    var token = sessionStorage.getItem('token')
    console.log("Token for update rules",token)
  
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'Application/json; charset=UTF-8',
        'authorization': 'Bearer '+token
        }),
        };
        
        
    return this.http.get("http://127.0.0.1:8000/history/org1/"+pan_number, httpOptions).pipe(map((response: Response) => {
        console.log("Response: ",response);
        return response;
    }),tap(event => {}, this.handleError))
  
  }

// 26AS
getdocument1(pan_number:string,path:string) :Observable <any> {
    var token = sessionStorage.getItem('token')
    console.log("Token for update rules",token)
    console.log("pan_number coming here",pan_number)
  
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'Application/json; charset=UTF-8',
        'authorization': 'Bearer '+token
        }),
        };
        const body = JSON.stringify({
            "pan":pan_number,
          });
        
    return this.http.post("http://127.0.0.1:8000/upload26AS/"+path, body,httpOptions).pipe(map((response: Response) => {
        console.log("Response: ",response);
        console.log("body",body)
        return response;
    }),tap(event => {}, this.handleError))
  
  }
  
  private handleError(err: HttpErrorResponse) {
    console.log(err);
    return Observable.throw(err.error());
  }
 

}



    

  

  // _getTaxes() :Observable <any> {
        
  //   var token = sessionStorage.getItem('token');
  //   const httpOptions = {
  //           headers: new HttpHeaders({
  //           'Content-Type': 'Application/json; charset=UTF-8',
  //           'Authorization': 'Bearer '+token
  //           }),
  //       };
     
  //   return this.http.get("http://10.72.23.93:9090/asset/all", httpOptions).map((response: Response) => {

  //           console.log("Response: ",response);
  //           return response;

  //   }).catch(e => { 
  //       console.log("Catched error"+JSON.stringify(e)+"Message:"+e.error.message); 
  //       return Observable.of(e); 
  //   });


//}


  //add tax

 