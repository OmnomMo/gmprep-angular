import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth';
import { HttpClient } from '@angular/common/http';

declare const google: any;

@Component({
	selector: 'app-google-sign-in',
	templateUrl: './google-sign-in.html',
	styleUrls: ['./google-sign-in.css']
})
export class GoogleSignInComponent implements OnInit {

	constructor(private authService: AuthService, private http: HttpClient) { }

	ngOnInit(): void {
		this.initializeGoogleSignIn();
	}

	initializeGoogleSignIn() {
		google.accounts.id.initialize({
			client_id: '22535597810-ml4s14qa3sq76doaohsjkf3r1vjpv1jo.apps.googleusercontent.com',
			callback: (response: any) => this.handleCredentialResponse(response)
		});

		google.accounts.id.renderButton(
			document.getElementById('google-signin-button'),
			{ theme: 'outline', size: 'large' }  // customization attributes
		);

		google.accounts.id.prompt(); // also display the One Tap dialog
	}

	handleCredentialResponse(response: any) {
		// response.credential is the JWT token
		console.log('Encoded JWT ID token: ' + response.credential);
		const userToken = response.credential;

		this.http.post(`http://localhost:5140/Users/login/${userToken}`, {})
			.subscribe({
				next: () => {
					console.log("Login Success!");
					this.authService.setAuthState(true);
				},
				error: (err) => {
					console.log("Login ERROR: " + err);
					this.authService.setAuthState(false);
				}
			})

	}

}