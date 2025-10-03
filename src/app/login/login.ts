import { Component } from '@angular/core';
import { GoogleSignInComponent } from "../google-sign-in/google-sign-in";
import { Router } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-login',
  imports: [GoogleSignInComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
	constructor(private router : Router, private authService : AuthService) {
		this.checkForLogin();
	}

	checkForLogin() {

		var _self = this;
		this.authService.authState$.subscribe({
			next(x) {
				console.log("Login State Changed:"  + x);
				if (x) {
					_self.router.navigate(['/campaignselection']);
				}
			}
		})
	}
}
