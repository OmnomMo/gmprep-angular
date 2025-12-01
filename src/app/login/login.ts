import { Component, inject, signal } from '@angular/core';
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
		this.authService.authError$.subscribe({
			next: e => {
				if (e != null) {
					this.loggingIn.set(false)
					this.loginError.set("Could not log in");
				}
			}
		});
	}

	formBuilder = inject(FormBuilder);
	loggingIn = signal<boolean>(false);
	loginError = signal<string>("");

	loginForm = this.formBuilder.group({
		email: ['', [Validators.required]],
		password: ['', [Validators.required]],
	});

	loginWithCredentials() {
		console.log('Trying to log in with credentials');
		this.authService.authenticateWithCredentials(this.loginForm.value);
		this.loggingIn.set(true);
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
