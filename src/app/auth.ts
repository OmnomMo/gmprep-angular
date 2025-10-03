import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  authState$ = this.authState.asObservable();

  constructor() { }

  setAuthState(state: boolean) {
	this.authState.next(state);
  }

  logout() {
	this.authState.next(false);
  }

  isAuthenticated(): boolean {
	return this.authState.value;
  }

}
