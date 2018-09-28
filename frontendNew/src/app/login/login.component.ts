import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Login } from './Login';
import { LoginService } from './login.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [LoginService]
})
export class LoginComponent {

    login = new Login();

    users: any[];
    valid = true;
    isLoggedIn = 'false';
    errormessage =""

    constructor(private router: Router, private loginService: LoginService) {
        //document.getElementById('login').style.display = 'none';
        
    }

    onSubmit() {
        this.valid = true;
        const name = this.login.userName;
        sessionStorage.setItem('username', this.login.userName);
        const password = this.login.password;
        this.loginService.validateUser(this.login).subscribe(
            res =>{
                console.log("Status: "+ res.message)
                if (res.Message === "Successful Login") {
                    this.isLoggedIn = 'true';
                    sessionStorage.setItem('isLoggedIn', this.isLoggedIn);
                    sessionStorage.setItem('token', res.Token);
                    console.log("Set token to"+res.Token)
                    if (this.login.userName == "org1") {
                        this.router.navigate(['/bank1']);
                    }
                    if (this.login.userName == "org2") {
                        this.router.navigate(['/bank2']);
                    }
                    if (this.login.userName == "org3") {
                        this.router.navigate(['/itd']);
                    }

                } else  {
                    if (res.Message == "Insuccessful Login") {
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
