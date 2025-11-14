import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GMUser } from './models/user';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { UrlBuilder } from './utils/url-builder';

@Injectable({
	providedIn: 'root',
})
export class AuthService {

	private user = new BehaviorSubject<GMUser | null>(null);
	user$ = this.user.asObservable();

	constructor(
		private http: HttpClient,
		private urlBuilder: UrlBuilder,
	) {}

	setAuthenticated( user: GMUser) {
		this.user.next(user);
		console.log('set authenticated');
	}

	logout() {
		this.http
			.post(
				this.urlBuilder.buildUrl(['logout']),
				{},
				{
					withCredentials: true,
					params: {
						useCookies: true,
					}
				},
			)
			.subscribe({
				next: () => {
					console.log('Successful logout');
				},
				error: (e) => {
					console.error('Error logging out: ' + e);
				},
			});

		this.user.next(null);
		//		console.log('Logging out. Deleting session token.');
		//		document.cookie = `userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
		//		this.authState.next(false);
		//		this.authToken.next('');
		//		this.user.next(null);
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



	isAuthenticated(): boolean {
		return (this.user.value != null);
		
	}

	authenticateWithCredentials(loginData: object) {
		console.log(loginData);
		this.http
			.post(this.urlBuilder.buildUrl(['login']), loginData, {
				withCredentials: true,
				params: {
					useCookies: true,
				},
			})
			.subscribe({
				next: () => {
					console.log('Login successful. Fetching user info');
					this.fetchUserInfo();
				},
				error: (e) => {
					console.log('Failed login: ' + e);
				},
			});
	}

	fetchUserInfo() {
		var url : string = this.urlBuilder.buildUrl(["users", "user"])
		this.http.get<GMUser>(url, {
			withCredentials: true,
			params: {
				useCookies: true,
			}
		}).subscribe({
			next: user => {
				this.setAuthenticated(user);
			},
			error: e => {
				console.error("Error fetching user: " + e);
			}
		})
	}

	createAccount(accountData: object) {
		this.http.post(this.urlBuilder.buildUrl(['register']), accountData).subscribe({
			next: () => {
				console.log('Create account success.');
				this.fetchUserInfo();
			},
			error: (e) => {
				console.error('Create account error: ');
				console.error(e);
			},
		});
	}

	getUser(): GMUser | null {
		return this.user.value;
	}
}
