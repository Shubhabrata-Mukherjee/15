import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { slideInOutAnimation } from '../animations/index';
import { Login } from './Login';
import { LoginService } from './login.service';
import { PlatformLocation } from '@angular/common';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    animations: [slideInOutAnimation],
    host: { '[@slideInOutAnimation]': '' },
    providers: [LoginService]
})
export class LoginComponent {

    login = new Login();

    users: any[];
    valid = true;
    isLoggedIn = 'false';
    errormessage = ""

    constructor(private router: Router, private loginService: LoginService, location: PlatformLocation) {
        this.login.userName = "org1";
        this.login.password = "org1";
        location.onPopState(() => {            
            sessionStorage.clear();
            this.router.navigate(['login'])
        })
    }

    onSubmit() {
        this.valid = true;
        const name = this.login.userName;
        sessionStorage.setItem('username', this.login.userName);
        const password = this.login.password;
        this.loginService.validateUser(this.login).subscribe(
            res => {
                console.log("Status: " + res.message)
                if (res.Message === "Successful Login") {
                    this.isLoggedIn = 'true';
                    sessionStorage.setItem('isLoggedIn', this.isLoggedIn);
                    sessionStorage.setItem('token', res.Token);
                    console.log("Set token to" + res.Token)
                    if (this.login.userName == "org1") {
                        //this.loginService.setData('BANK');
                        //console.log(this.loginService.getData());
                        sessionStorage.setItem('loginUserType', 'BANK');
                        // sessionStorage.setItem('loginUserType', 'BANK1');
                        this.router.navigate(['/Bank/form15gh']);
                    }
                    if (this.login.userName == "org2") {
                        //this.loginService.setData('BANK');
                        sessionStorage.setItem('loginUserType', 'BANK2');
                        this.router.navigate(['/Bank/form15gh']);
                    }
                    if (this.login.userName == "org3") {
                        //this.loginService.setData('ITD');
                        sessionStorage.setItem('loginUserType', 'ITD');
                        this.router.navigate(['/ITD/form15gh']);
                        //this.router.navigate(['/itd']);
                    }

                } else {
                    if (res.Message == "Unsuccessful Login") {
                        this.errormessage = res.Message;
                    } else {
                        this.errormessage = res.error.message;
                    }
                    this.isLoggedIn = 'false';
                    sessionStorage.setItem('isLoggedIn', this.isLoggedIn);
                    this.valid = false;

                }

            }

        );

    }
}
