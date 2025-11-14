import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	imports: [ReactiveFormsModule],
	templateUrl: './login.html',
	styleUrl: './login.css',
})
export class Login {
	constructor(
		private router: Router,
		private authService: AuthService,
	) {
		this.checkForLogin();
	}

	formBuilder = inject(FormBuilder);

	loginForm = this.formBuilder.group({
		email: ["", [Validators.required]],
		password: ["", Validators.required],
	});

	loginWithCredentials () {
		console.log("Trying to log in with credentials");
		this.authService.authenticateWithCredentials(this.loginForm.value);
	}

	logoutTest() {
		this.authService.logout();
	}


	checkForLogin() {
		var _self = this;
		this.authService.user$.subscribe({
			next(x) {
				console.log('Login State Changed:' + x);
				if (x != null) {
					_self.router.navigate(['/campaignselection']);
				}
			},
		});
	}
}
