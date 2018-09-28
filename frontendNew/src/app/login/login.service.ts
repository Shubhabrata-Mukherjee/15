import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError,tap, map } from 'rxjs/operators';

import { Login } from './login';

@Injectable()
export class LoginService {
    username: string;
    constructor(private http: HttpClient) { }

    validateUser(login: Login) :Observable <any> {
        
        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type': 'Application/json; charset=UTF-8'
            }),
            };
            const body = JSON.stringify(login);
            console.log(body);
            
        return this.http.post("http://127.0.0.1:8000/login", body, httpOptions).pipe(map((response: Response) => {
            console.log("Response: ",response);
            return response;
        }),tap(event => {}, this.handleError))
   
    }

     private handleError(err: HttpErrorResponse) {
        console.error(err);
        return Observable.throw(err.error() || 'Server error');
    }
}