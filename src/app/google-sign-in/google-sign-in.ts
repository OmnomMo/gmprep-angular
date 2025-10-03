import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../auth';
import { HttpClient } from '@angular/common/http';
import { GMUser } from '../models/user';

declare const google: any;

@Component({
	selector: 'app-google-sign-in',
	templateUrl: './google-sign-in.html',
	styleUrls: ['./google-sign-in.css']
})
export class GoogleSignInComponent implements AfterViewInit {

	constructor(private authService: AuthService, private http: HttpClient) { }

	ngAfterViewInit(): void {
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
				next: (response) => {
					console.log("Login Success!");
					this.authService.setAuthenticated(userToken, response as GMUser);
				},
				error: (err) => {
					console.log("Login ERROR: " + err);
				}
			})

	}

}