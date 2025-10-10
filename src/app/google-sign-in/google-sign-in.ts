import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from '../auth';
import { HttpClient } from '@angular/common/http';
import { GMUser } from '../models/user';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Observable, Subject } from 'rxjs';

declare const google: any;

@Component({
	selector: 'app-google-sign-in',
	templateUrl: './google-sign-in.html',
	styleUrls: ['./google-sign-in.css']
})
export class GoogleSignInComponent implements AfterViewInit {

	constructor(private authService: AuthService, private http: HttpClient) { }

	ngAfterViewInit(): void {

		console.log("checking for stored login token")
		var userToken : string = this.authService.retrieveUserToken()
		
		
		if (userToken == "") {
			console.log("did not find token, initialize google login")
			this.initializeGoogleSignIn();
		} else {

			var payload : JwtPayload = jwtDecode(userToken);

			var now : number = Math.round((new Date()).getTime() / 1000);
			var exp : number | undefined = payload.exp;

			console.log(`login token expires in ${exp! - now} seconds`);

			//token expired, initialize sign in
			if (now > exp!) {
				this.waitForGoogle(() => this.initializeGoogleSignIn);
			} else {
				this.signIn(userToken)
			}
		}
	}

	//sometimes google is not defined when we load the page. 
	//HACK: wait until google is defined.
	waitForGoogle(callback : () => void) {
		var interval = setInterval(() => {
			console.log("google is not defined yet. wait for google")
			if (google != null && google != undefined) {
				("google found, proceed!")
				clearInterval(interval)
				callback();
			}
		}, 100);
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

		this.signIn(userToken);
	}

	signIn(userToken : string) {
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