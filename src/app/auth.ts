import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GMUser } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  authState$ = this.authState.asObservable();

  private authToken = new BehaviorSubject<string>("");
  authToken$ = this.authToken.asObservable();

  private user = new BehaviorSubject<GMUser | null>(null);
  user$ = this.user.asObservable();

  constructor() { }

  setAuthenticated(token : string, user : GMUser) {
	this.authState.next(true);
	this.authToken.next(token);
	this.user.next(user);
  }

  logout() {
	this.authState.next(false);
	this.authToken.next("");
	this.user.next(null);
  }

  getUserToken (): string {
	return this.authToken.value;
  }

  isAuthenticated(): boolean {
	return this.authState.value;
  }

}
