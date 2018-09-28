import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';


import {catchError, tap, map } from "rxjs/operators";
import { LimitAmount } from './limit_amount';
import { ResponseContentType } from '@angular/http';
@Injectable()
export class ItdService {

  

  constructor(private http: HttpClient){}
  
//   updateRules(gender:string,amountg:string,amounts:string,age:string) :Observable <any> {


//     var limit:LimitAmount=new LimitAmount();
//     limit.gender=gender;
//     limit.amountg=amountg;
//     limit.amounts=amounts;
//     limit.age=age;
//   var token = sessionStorage.getItem('token');
//    const httpOptions = { headers: new HttpHeaders({ 
//      'Content-Type': 'Application/json; charset=UTF-8',
//       'Authorization': 'Bearer ' + token }),
//      };

//      const body = JSON.stringify(limit);
//      console.log(body);

//    return this.http.post("http://127.0.0.1:8000/update/org3/rules", body, httpOptions).pipe(
//      map((response: Response) => { console.log("Response: ", response);
//       return response; }), tap(event => { }, this.handleError))

 
   
//  }
updateRules(rule_t:string,rule_i:string,rule_y:string,gender:string,amountg:string,amounts:string,amountss:string,ages:string,agess:string) :Observable <any> {
  var token = sessionStorage.getItem('token')
  console.log("Token for update rules",token)

  // const httpOptions = {
  //     headers: new HttpHeaders({
  //     'Content-Type': 'Application/json;',
  //     'Authorization': 'Bearer '+token
  //     }),
  //     };
  //     const body = JSON.stringify({
  //       "gender":gender,
  //       "amount_general":amountg,
  //       "amount_senior":amounts,
  //       "age":age
  //     });
  //     console.log("Body",body);

    

  const httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'Application/json; charset=UTF-8',
    'authorization':"Bearer "+token
    }),
    };
    const body = JSON.stringify({
            "rule_type":rule_t,
            "rule_income":rule_i,
            "rule_year": rule_y,
            "gender":gender,
            "amount_general":amountg,
            "amount_senior":amounts,
            "amount_super_senior":amountss,
            "age_senior":ages,
            "age_super_senior":agess
          });


return this.http.post("http://127.0.0.1:8000/update/org3/rules",body,httpOptions).pipe(map((response: Response) => {
      console.log("Response is : ",response);
      return response;
  }),tap(event => {}, this.handleError))

}

getRules() :Observable <any> {
  var token = sessionStorage.getItem('token')
  console.log("Token for update rules",token)


  const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'Application/json; charset=UTF-8',
      'authorization': 'Bearer '+token
      }),
      };
      
      console.log("httpOptions",httpOptions)

  return this.http.get("http://127.0.0.1:8000/query/rules", httpOptions).pipe(map((response: Response) => {
      console.log("Response: ",response);
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
      
      
  return this.http.get("http://127.0.0.1:8000/history/"+pan_number, httpOptions).pipe(map((response: Response) => {
      console.log("Response: ",response);
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



getdocument(pan_number:string) :Observable <any> {
  var token = sessionStorage.getItem('token')
  console.log("Token for get document",'Bearer '+token)

  
     
  return this.http.post("http://127.0.0.1:8000/storehash/org3/"+pan_number,{"":""}, {
    
        
    headers: new HttpHeaders({
    'Content-Type': 'Application/json; charset=UTF-8',
    'authorization': 'Bearer '+token
    
    }),
    responseType: 'blob'
     

  }
  ).pipe(map((response: Blob) => {
      return new Blob([response], { type: 'application/pdf' });   
  }),tap(event => {}, this.handleError))

}
getdocumentHistory(pan_number:string) :Observable <any> {
  var token = sessionStorage.getItem('token')
  console.log("Token for get document",'Bearer '+token)

  console.log("this.PAN"+pan_number)

     
  return this.http.get("http://127.0.0.1:8000/history26AS/"+pan_number, {
    
        
    headers: new HttpHeaders({
    'Content-Type': 'Application/json; charset=UTF-8',
    'authorization': 'Bearer '+token
    
    }),
    
     

  }
  ).pipe(map((response: Response) => {
      return  response;
  }),tap(event => {}, this.handleError))

}


        private handleError(err: HttpErrorResponse) {
          console.error(err);
            return Observable.throw(err.error() || 'Server error'); 
          }

        ngOnInit() {
        }

}



/*const options: {
            headers?: HttpHeaders,
            observe?: 'body',
            params?: HttpParams,
            reportProgress?: boolean,
            responseType: 'text',
            withCredentials?: boolean
        } = {
            headers: headers,
            params: params,
            responseType: 'text'
        };
    */