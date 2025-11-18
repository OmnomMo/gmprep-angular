import { Injectable } from '@angular/core';
import { BehaviorSubject, first, Observable, Subject } from 'rxjs';
import { GMUser } from './models/user';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { UrlBuilder } from './utils/url-builder';

@Injectable({
	providedIn: 'root',
})
export class AuthService {

	private user = new BehaviorSubject<GMUser | null>(null);
	user$ = this.user.asObservable();

	private authError = new Subject<HttpErrorResponse>;
	authError$ = this.authError.asObservable();

	constructor(
		private http: HttpClient,
		private urlBuilder: UrlBuilder,
	) {}

	setAuthenticated( user: GMUser) {
		this.user.next(user);
		this.storeUser();
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
		this.storeUser();
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

		if (this.user.value == null) {
			this.user.next(this.retrieveUser());
		}

		return (this.user.value != null);
		
	}

	isUserNameTaken(username : string): Observable<boolean> {
		var taken = new Subject<boolean>();

		this.http.get(this.urlBuilder.buildUrl(["checkusername", username])).subscribe({
			next: () => {
				taken.next(false);
			},
			error: () => {
				taken.next(true);
			}
		})

		return taken.asObservable();
	}

	isEmailTaken(email : string): Observable<boolean> {
		var taken = new Subject<boolean>();

		this.http.get(this.urlBuilder.buildUrl(["checkemail", email])).subscribe({
			next: () => {
				taken.next(false);
			},
			error: () => {
				taken.next(true);
			}
		});

		return taken.asObservable();
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
					this.authError.next(e);
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
				this.authError.next(e);
			}
		})
	}

	createAccount(accountData: object) {
		this.http.post(this.urlBuilder.buildUrl(['register']), accountData).subscribe({
			next: () => {
				console.log('Create account success.');
				this.authenticateWithCredentials(accountData);
			},
			error: (e : HttpErrorResponse) => {
				console.error('Create account error: ');
				console.error(e);
				this.authError.next(e);
			},
		});
	}

	getUser(): GMUser | null {
		return this.user.value;
	}

	updatePassword(passwordData: object) : Observable<string | null> {

		var errorMsg = new Subject<string | null>;

		this.http.post(this.urlBuilder.buildUrl(["changepassword"]), passwordData, {
			withCredentials: true,
		}).subscribe({
			next: () => {
				console.log("Password change success.");
				errorMsg.next(null);
			},
			error: e => {
				var error = e as HttpErrorResponse
				console.error("Password change error");
				console.error(error.statusText);
				errorMsg.next(error.statusText);
			}
		})

		return errorMsg.asObservable().pipe(first());
	}
}
