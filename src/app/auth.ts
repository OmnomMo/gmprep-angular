import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GMUser } from './models/user';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private authState = new BehaviorSubject<boolean>(false);
	authState$ = this.authState.asObservable();

	private authToken = new BehaviorSubject<string>('');
	authToken$ = this.authToken.asObservable();

	private user = new BehaviorSubject<GMUser | null>(null);
	user$ = this.user.asObservable();

	constructor(private http: HttpClient) {}

	setAuthenticated(token: string, user: GMUser) {
		this.user.next(user);
		this.authToken.next(token);
		this.authState.next(true);
		console.log('set authenticated');
		this.storeUserToken();
		this.storeUser();
	}

	logout() {
		console.log('Logging out. Deleting session token.');
		document.cookie = `userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
		this.authState.next(false);
		this.authToken.next('');
		this.user.next(null);
	}

	storeUserToken() {
		console.log('store user token');
		console.log(this.authToken.value);
		document.cookie = `userToken=${this.authToken.value}; Expires=DateTime.UtcNow.AddDays(7)`;
	}

	retrieveUserToken(): string {
		console.log(document.cookie);
		var cookies: string[] = document.cookie.split(';');
		var foundToken: string = '';
		cookies.forEach((c) => {
			var split: string[] = c.split('=');
			console.log('checking cookie ' + split[0]);
			if (split[0].includes('userToken')) {
				foundToken = split[1];
			}
		});

		if (foundToken != '') {
			console.log('found token');
			return foundToken;
		} else {
			return '';
		}
	}

	storeUser() {
		console.log('store user');
		console.log(this.user.getValue());
		window.localStorage.setItem('User', JSON.stringify(this.user.getValue()));
	}

	retrieveUser(): GMUser | null {
		console.log('retrieving user from local storage');
		var user: GMUser | undefined = JSON.parse(window.localStorage.getItem('User') ?? '');
		if (user === undefined) {
			return null;
		}
		return user;
	}

	getUserToken(): string {
		return this.authToken.value;
	}

	login(token: string) {
		this.http.post(`http://localhost:5140/Users/login/${token}`, {}).subscribe({
			next: (response) => {
				console.log('Login Success!');
				this.setAuthenticated(token, response as GMUser);
			},
			error: (err) => {
				console.error('Login ERROR: ' + err);
			},
		});
	}

	isAuthenticated(): boolean {
		if (this.authState.value) {
			return true;
		}

		console.log('checking for stored login token');
		var userToken: string = this.retrieveUserToken();

		//If auth state is false, but we have a valid token and user data stored in local storage / cookies,
		//we are still logged in!
		if (userToken == '') {
			return false;
		} else {
			var payload: JwtPayload = jwtDecode(userToken);

			var now: number = Math.round(new Date().getTime() / 1000);
			var exp: number | undefined = payload.exp;

			console.log(`login token expires in ${exp! - now} seconds`);
			var isExpired: boolean = now > exp!; 
			
			//HACK: For now we just dont let the token expire to be fixed
			isExpired = false;

			if (isExpired) {
			//token expired, initialize sign in
				return false;
			} else {
				var user: GMUser | null = this.retrieveUser();

				if (user == null) {
					return false;
				}

				this.setAuthenticated(userToken, user);
				return true;
			}
		}
	}

	getUser(): GMUser | null {
		return this.user.value;
	}
}
